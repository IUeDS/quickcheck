app.component('qcViewAttempts', {
    controller: ViewAttemptsController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('viewAttemptsContainerTemplate.html');
    }]
});

ViewAttemptsController.$inject = ['$location', 'Manage', 'Submission', 'Utilities'];

function ViewAttemptsController($location, Manage, Submission, Utilities) {
    var vm = this;

    //variables
    vm.assessment = null;
    vm.assessmentId = '';
    vm.assignment = null;
    vm.attempts = []; //all attempts
    vm.canvasCourse = null;
    vm.courseContext = null;
    vm.currentPage = 'results';
    vm.displayedAttempts = []; //those shown to user (after filters, etc.)
    vm.dueAt = null;
    vm.gradesLoading = true;
    vm.largeClassSize = false;
    vm.pointsPossible = 0;
    vm.questions = [];
    vm.release = false;
    vm.responseAttempt = null;
    vm.responseViewVisible = false;
    vm.search = { 'studentLastName': '' }; //for searching through students
    vm.showUngradedOnly = false;
    vm.studentResponses = [];
    vm.submissions = [];
    vm.ungradedAttempts = [];
    vm.users = [];
    vm.utils = new Utilities({scrollingLtiHeight: 100});

    //functions
    vm.$onInit = $onInit;
    vm.addBestAttempt = addBestAttempt;
    vm.getAssessmentIdFromUrl = getAssessmentIdFromUrl;
    vm.getHighestScoresBeforeDueDate = getHighestScoresBeforeDueDate;
    vm.getSubmissions = getSubmissions;
    vm.getUsers = getUsers;
    vm.hideResponses = hideResponses;
    vm.initAttemptData = initAttemptData;
    vm.isAttemptsView = isAttemptsView;
    vm.isLargeClassSize = isLargeClassSize;
    vm.isLate = isLate;
    vm.isSubstringFound = isSubstringFound;
    vm.onAutoGradeSuccess = onAutoGradeSuccess;
    vm.searchStudentLastName = searchStudentLastName;
    vm.toggleAnalytics = toggleAnalytics;
    vm.toggleUngraded = toggleUngraded;
    vm.viewResponses = viewResponses;

    function $onInit() {
        vm.assessmentId = vm.getAssessmentIdFromUrl();
        vm.utils.loadingStarted();

        Manage.getAttemptsAndResponses(vm.assessmentId, vm.utils.contextId)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.initAttemptData(data);
                vm.utils.loadingFinished();
                vm.getUsers();
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function addBestAttempt(currentBestAttempt, attemptsToGrade) {
        //if the user didn't have any valid attempts before the due date, return out
        if (!currentBestAttempt) {
            return false;
        }

        var currentUser = currentBestAttempt.student.lti_custom_user_id,
            submission = new Submission(currentBestAttempt, vm.pointsPossible, vm.submissions);
        //since we've now gone through all attempts for the previous user, we know for sure what the highest score was;
        //if the assignment is gradeable, as yet ungraded, and student is still in course, then add to the list
        needsGrade = (submission.needsGrade() && vm.users[currentUser]) ? true : false;
        if (needsGrade) {
            attemptsToGrade.push({
                'attemptId': currentBestAttempt.id
            });
        }
    }

    function getAssessmentIdFromUrl() {
        var url = $location.url(),
            splitUrl = url.split('/assessment/'),
            idSplit = splitUrl[1].split('/'),
            assessmentId = idSplit[0];

        return assessmentId;
    }

    //loop through all attempts in O(N) time to get highest calculated score before the
    //due date for ungraded assignments; attempts are already sorted by name/user, so
    //we move on down the list and change the current user info as soon as we reach an
    //attempt where the user ID is different; before we change to the next user, we've
    //sorted through all attempts for the previous user and know which attempt has the
    //highest score before the due date, so if the assignment is gradeable, ungraded,
    //and the user is still in the course, then add attempt to ungraded list
    function getHighestScoresBeforeDueDate() {
        var attemptsToGrade = [],
            currentBestAttempt = null,
            currentUserId = vm.attempts[0].student.lti_custom_user_id,//initialize for beginning
            needsGrade = false;

        vm.attempts.forEach(function(attempt, index) {
            //when we reach the next user in the sorted list
            if (attempt.student.lti_custom_user_id !== currentUserId) {
                vm.addBestAttempt(currentBestAttempt, attemptsToGrade);
                currentUserId = attempt.student.lti_custom_user_id;
                currentBestAttempt = null;
            }
            if (!vm.isLate(attempt)) {
                if (!currentBestAttempt) {
                    currentBestAttempt = attempt;
                }
                else if (+(attempt.calculated_score) > currentBestAttempt.calculated_score) {
                    currentBestAttempt = attempt;
                }
            }
        });

        //if end of the array, no next user to compare to, so check just for this last user
        vm.addBestAttempt(currentBestAttempt, attemptsToGrade);

        return attemptsToGrade;
    }

    function getSubmissions() {
        //fetch submissions/grades
        Manage.getAttemptSubmissions(vm.assessmentId, vm.utils.contextId)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.submissions = data.submissions;
                //determine if any assignments need to be graded
                if (vm.attempts.length && vm.submissions) {
                    vm.ungradedAttempts = vm.getHighestScoresBeforeDueDate();
                }
                vm.gradesLoading = false;
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function getUsers() {
        if (!vm.courseContext || vm.largeClassSize) {
            return;
        }
        //fetch users so we can determine if any have dropped; this is necessary
        //since grade passback would result in an error for a dropped student
        Manage.getUsersInCourse(vm.courseContext.lti_custom_course_id)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.users = data.users;
                vm.getSubmissions(); //get submissions next; only mark ungraded if user is still in course
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function hideResponses() {
        vm.responseViewVisible = false;
        vm.utils.setLtiHeight();
    }

    function initAttemptData(attemptData) {
        vm.attempts = attemptData.attempts;
        vm.displayedAttempts = vm.attempts;
        vm.assessment = attemptData.assessment;
        vm.assignment = attemptData.assignment;
        vm.courseContext = attemptData.courseContext;
        vm.canvasCourse = attemptData.canvasCourse;
        //if graded/an assignment
        if (vm.assignment) {
            vm.pointsPossible = vm.assignment.points_possible;
            if (vm.assignment.due_at && vm.assignment.due_at != 0) {
                var timezone = vm.courseContext.time_zone,
                    dueAtDate = new Date(+(vm.assignment.due_at) * 1000),
                    dueAt = vm.utils.convertTimeWithTimezone(dueAtDate, timezone, true);
                vm.dueAt = vm.utils.formatTimeWithTimeZone(dueAt, timezone);
            }
        }
        if (attemptData.release) {
            vm.release = attemptData.release;
        }
        //if a very large course, grading functionality disabled for performance
        if (vm.isLargeClassSize()) {
            vm.largeClassSize = true;
        }
    }

    function isAttemptsView() {
        if (!vm.responseViewVisible && !vm.analyticsViewVisible) {
            return true;
        }

        return false;
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

    function isLargeClassSize() {
        if (vm.canvasCourse.total_students > 1000) {
            return true;
        }

        return false;
    }

    function isSubstringFound(string1, string2) {
        if (string1.toLowerCase().indexOf(string2.toLowerCase()) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    function onAutoGradeSuccess($event) {
        var successfulSubmissions = $event.successfulSubmissions;
        successfulSubmissions.forEach(function(successfulSubmission) {
            var attempt = successfulSubmission.attempt,
                score = successfulSubmission.score * 100, //back-end 0-1 scale, front-end is 0-100
                submission = new Submission(attempt, vm.pointsPossible, vm.submissions);

            submission.update(score);
        });
    }

    function searchStudentLastName() {
        vm.displayedAttempts = vm.attempts.filter(function(attempt) {
            if (vm.isSubstringFound(attempt.student.lis_person_name_family, vm.search.studentLastName)) {
                return true;
            }
        });
    }

    function toggleAnalytics() {
        vm.analyticsViewVisible = !vm.analyticsViewVisible;
        if (!vm.analyticsViewVisible) {
            vm.utils.setLtiHeight();
        }
    }

    function toggleUngraded() {
        vm.showUngradedOnly = !vm.showUngradedOnly;
        if (vm.showUngradedOnly) {
            vm.displayedAttempts = vm.attempts.filter(function(attempt) {
                var submission = new Submission(attempt, vm.pointsPossible, vm.submissions);
                if (submission.needsGrade()) {
                    return true;
                }
            });
        }
        else {
            vm.displayedAttempts = vm.attempts; //reset to original
        }
    }

    function viewResponses($event) {
        var attempt = $event.attempt;
        vm.utils.loadingStarted();
        Manage.getStudentResponses(attempt.id)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.responseAttempt = attempt;
                vm.questions = data.questions;
                vm.studentResponses = data.responses;
                vm.responseViewVisible = true;
                vm.utils.loadingFinished('#response-header');
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }
}