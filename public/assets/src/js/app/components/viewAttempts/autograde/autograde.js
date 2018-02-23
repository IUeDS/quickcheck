app.component('qcAutograde', {
    controller: AutogradeController,
    controllerAs: 'vm',
    bindings: {
        onSuccess: '&qcOnSuccess',
        pointsPossible: '=qcPointsPossible',
        submissions: '=qcSubmissions',
        ungradedAttempts: '=qcUngradedAttempts',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('autogradeTemplate.html');
    }]
});

AutogradeController.$inject = ['Manage'];

function AutogradeController(Manage) {
    var vm = this;

    //variables
    vm.error = false;
    vm.graded = false;
    vm.loading = false;
    vm.paginationSize = 50;
    vm.success = false;
    vm.successfulSubmissions = [];
    vm.ungradedAssessment = false;

    //functions
    vm.$onInit = $onInit;
    vm.autoGrade = autoGrade;
    vm.beforeDueDate = beforeDueDate;
    vm.isConfirmed = isConfirmed;
    vm.onAutogradeFinished = onAutogradeFinished;
    vm.sendGrades = sendGrades;
    vm.sendNextPagination = sendNextPagination;

    function $onInit() {
        //if not placed in an assignment, or for 0 points, ungraded, no autograde possible
        if (vm.submissions === null || vm.pointsPossible === 0) {
            vm.ungradedAssessment = true;
            vm.graded = true;
            return;
        }

        //otherwise, if graded assignment, check to see if any remaining attempts to grade
        vm.graded = !vm.ungradedAttempts.length ? true : false;

        //set tooltip
        $('[data-toggle="tooltip"]').tooltip();
    }

    function autoGrade() {
        if (!vm.isConfirmed()) {
            return false;
        }

        //reset if necessary
        vm.error = false;
        vm.success = false;

        if (!vm.ungradedAttempts.length) {
            vm.error = 'There are no ungraded attempts for this assessment.';
            vm.loading = false;
            return;
        }

        //to make sure we don't run into any errors with max execution time in PHP on the back-end,
        //in the unlikely but possible scenario that a class with something crazy like 1000 students
        //doesn't have automatic grading on assessment submission, and the instructor wants to
        //auto-grade those 1000 students by clicking the button, we'll lump this into batches of 50
        var paginateGrading = vm.ungradedAttempts > 50 ? true : false;
        vm.sendGrades(vm.ungradedAttempts, paginateGrading, 0);
    }

    function beforeDueDate() {
        var currentTime = Date.now();
        if (currentTime < vm.dueAt) {
            return true;
        }
        else {
            return false;
        }
    }

    function isConfirmed() {
        var confirmMsg = 'Are you sure you wish to run the auto-grade function? This action ' +
            'cannot be undone. All students with ungraded assignments who have made an attempt ' +
            'will receive a grade in the gradebook calculated from their highest score made ' +
            'before the due date (if applicable). Students who have not made an attempt will ' +
            'remain ungraded. If you have a large class, this process may take several minutes.';

        //in regression testing, protractor flips out from js confirms/alerts
        if (vm.utils.isRegressionEnv()) {
            return true;
        }

        return confirm(confirmMsg);
    }

    function onAutogradeFinished(resp, data) {
        vm.loading = false;
        if (!vm.utils.isSuccessResponse(resp)) {
            var errorMessage = data.reason;
            vm.error = errorMessage;
            return;
        }

        vm.success = true;
        vm.onSuccess({
            $event: {
                successfulSubmissions: vm.successfulSubmissions
            }
        });
    }

    function sendGrades(remainingAttempts, isPaginated, paginationNumber) {
        var attemptsToGrade = [],
            startIndex = vm.paginationSize * paginationNumber,
            endIndex = startIndex + vm.paginationSize;

        if (!isPaginated) {
            attemptsToGrade = remainingAttempts;
        }
        else {
            attemptsToGrade = remainingAttempts.slice(startIndex, endIndex);
        }

        Manage.autoGrade({ 'attempts': attemptsToGrade })
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp),
                    successfulSubmissions = data.successfulSubmissions;

                vm.successfulSubmissions = vm.successfulSubmissions.concat(successfulSubmissions);

                if (isPaginated) {
                    vm.sendNextPagination(paginationNumber, endIndex, remainingAttempts);
                }
                else {
                    vm.onAutogradeFinished(resp, data);
                }
            }, function(resp) {
                vm.error = vm.utils.getError(resp);
                vm.loading = false;
            });
    }

    function sendNextPagination(paginationNumber, startIndex, remainingAttempts) {
        var nextPage = paginationNumber + 1,
            nextAttempts = remainingAttempts.slice(startIndex),
            isPaginated = true;

        if (nextAttempts.length <= vm.paginationSize) {
            isPaginated = false;
        }

        vm.sendGrades(nextAttempts, isPaginated, nextPage);
    }

}