app.component('qcCompletionModal', {
    controller: CompletionModalController,
    controllerAs: 'vm',
    bindings: {
        attemptId: '<qcAttemptId',
        complete: '<qcComplete',
        pointsPossible: '<qcPointsPossible',
        score: '<qcScore'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('completionModalTemplate.html');
    }]
});

CompletionModalController.$inject = ['Assessment', 'Utilities'];

function CompletionModalController(Assessment, Utilities) {
    var vm = this;

    vm.error = false;
    vm.graded = false;
    vm.isInModule = false;
    vm.loading = false;
    vm.utils = new Utilities();

    vm.$onChanges = $onChanges;
    vm.isAutomaticPassback = isAutomaticPassback;
    vm.isPendingPassback = isPendingPassback;
    vm.isUngraded = isUngraded;
    vm.restart = restart;
    vm.submitGrade = submitGrade;

    function $onChanges(changesObj) {
        if (!changesObj.complete) {
            return;
        }

        if (changesObj.complete.currentValue === false) {
            return;
        }

        vm.submitGrade();
        vm.isInModule = vm.utils.isInCanvasModule();
    }

    function isAutomaticPassback() {
        if (vm.graded === 'graded') {
            return true;
        }

        return false;
    }

    function isPendingPassback() {
        if (vm.graded === 'pending') {
            return true;
        }

        return false;
    }

    function isUngraded() {
        if (!vm.graded) {
            return true;
        }

        return false;
    }

    function restart() {
        //hard page refresh to ensure a new attempt is created
        window.location.reload();
    }

    function submitGrade() {
        //doubt this would happen, but just in case, make sure
        //grade is not re-submitted
        if (vm.graded) {
            return false;
        }

        vm.loading = true;
        vm.error = false; //reset if error encountered previously
        vm.utils.loadingStarted();
        Assessment.gradePassback(vm.attemptId)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.graded = data.attemptGraded;
                vm.loading = false;
                vm.utils.loadingFinished();
            }, function(resp) {
                vm.loading = false;
                var serverError = vm.utils.getQuizError(resp),
                    errorMessage = serverError ? serverError : 'Error submitting grade.';
                vm.error = errorMessage;
                vm.utils.loadingFinished();
            });
    }
}