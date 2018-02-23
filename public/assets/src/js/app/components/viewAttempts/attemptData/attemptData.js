app.component('qcAttemptData', {
    controller: AttemptDataController,
    controllerAs: 'vm',
    bindings: {
        attempts: '<qcAttempts',
        courseContext: '<qcCourseContext',
        gradesLoading: '<qcGradesLoading',
        isStudent: '<qcIsStudent',
        isVisible: '<qcIsVisible',
        largeClassSize: '<qcLargeClassSize',
        onViewResponses: '&qcViewResponses',
        pointsPossible: '<qcPointsPossible',
        showResponses: '<qcShowResponses',
        submissions: '<qcSubmissions',
        users: '<qcUsers',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('attemptDataTemplate.html');
    }]
});

AttemptDataController.$inject = [];

function AttemptDataController() {
    var vm = this;

    //variables
    vm.numAttemptsDisplayed = 100;
    vm.studentsWithFirstRow = {}; //for tracking table borders, etc.

    //functions
    vm.$onInit = $onInit;
    vm.$onChanges = $onChanges;
    vm.dateDiff = dateDiff;
    vm.getCalculatedScore = getCalculatedScore;
    vm.getCountCorrect = getCountCorrect;
    vm.getCountIncorrect = getCountIncorrect;
    vm.isFirstRowForStudent = isFirstRowForStudent;
    vm.isLate = isLate;
    vm.loadMoreAttempts = loadMoreAttempts;
    vm.parseAttempts = parseAttempts;
    vm.responsesAvailable = responsesAvailable;
    vm.viewResponses = viewResponses;

    function $onInit() {
        vm.parseAttempts();
        vm.utils.setLtiHeight();
    }

    function $onChanges(changes) {
        //if attempts array is updated (such as on a search) then
        //we need to reformat the incoming data
        if (changes.attempts) {
            vm.parseAttempts();
        }
    }

    function dateDiff(createdAt, updatedAt) {
        createdAt = vm.utils.convertSqlTimestamp(createdAt);
        updatedAt = vm.utils.convertSqlTimestamp(updatedAt);

        var milliseconds = updatedAt - createdAt,
            seconds = Math.floor(milliseconds / 1000);

        return vm.utils.formatDateDiff(seconds);
    }

    function getCalculatedScore(attempt) {
        return attempt.calculated_score * 100;
    }

    //custom activities send count correct to the back-end, but quizzes calculate based on responses
    function getCountCorrect(attempt) {
        if (attempt.count_correct !== null) {
            return attempt.count_correct;
        } else {
            var countCorrect = 0;
            attempt.student_responses.forEach(function(response) {
                if (response.is_correct == '1') {
                    countCorrect++;
                }
            });
            return countCorrect;
        }
    }

    //custom activities send count correct to the back-end, but quizzes calculate based on responses
    function getCountIncorrect(attempt) {
        if (attempt.count_incorrect !== null) {
            return attempt.count_incorrect;
        }
        else {
            var countIncorrect = 0;
            attempt.student_responses.forEach(function(response) {
                if (response.is_correct == '0') {
                    countIncorrect++;
                }
            });
            return countIncorrect;
        }
    }

    function isFirstRowForStudent(attempt) {
        var key = 'user-' + attempt.student.lti_user_id; //in case the user id starts with an int
        if (vm.studentsWithFirstRow[key]) {
            return false;
        } else {
            vm.studentsWithFirstRow[key] = true;
            return true;
        }
    }

    function isLate(attempt) {
        if (!attempt.due_at) {
            return false;
        }

        //convert by timezone -- attempt updated_at is in the default server timezone,
        //whereas the dueAt timestamp is in the timezone specific to the course
        var timezone = vm.courseContext.time_zone,
            updatedAt = vm.utils.convertTimeWithTimezone(attempt.updated_at, timezone),
            dueAt = vm.utils.convertTimeWithTimezone(attempt.due_at, timezone, true);

        if (updatedAt >= dueAt) {
            return true;
        }

        return false;
    }

    function loadMoreAttempts() {
        //the infinite loading angular directive does not take into account whether
        //the element is visible or not, resulting in annoying stuttering if viewing
        //responses or analytics. as of Nov 2017, the issue has not yet been fixed,
        //but there are open forks on github that will hopefully be implemented later.
        //for now, although a little clunky, we get visibility from parent component.
        //also, make sure we're not continuing to hit this after all attempts displayed
        if (vm.isVisible && vm.numAttemptsDisplayed < vm.attempts.length) {
            vm.numAttemptsDisplayed += 100;
            vm.utils.setLtiHeight();
        }
    }

    function parseAttempts() {
        vm.attempts.forEach(function(attempt) {
            if (vm.isLate(attempt)) {
                attempt.isLate = true;
            }
            if (vm.isStudent) { //skip the last part if a student
                return;
            }
            if (vm.isFirstRowForStudent(attempt)) {
                attempt.firstRowForStudent = true;
            }
        });
    }

    function responsesAvailable(attempt) {
        if (!attempt.student_responses.length) {
            return false;
        }

        if (!vm.showResponses) {
            return false;
        }

        return true;
    }

    function viewResponses(attempt) {
        vm.onViewResponses({
            $event: {
                attempt: attempt
            }
        });
    }
}