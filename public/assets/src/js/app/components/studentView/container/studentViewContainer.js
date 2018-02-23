app.component('qcStudentView', {
    controller: StudentViewController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('studentViewContainerTemplate.html');
    }]
});

StudentViewController.$inject = ['Manage', 'Utilities'];

function StudentViewController(Manage, Utilities) {
    var vm = this;

    //variables
    vm.attemptAssessment = null;
    vm.courseContext = null;
    vm.displayedAttempts = [];
    vm.questions = [];
    vm.responses = [];
    vm.responseAttempt = null;
    vm.showResponses = false; //set by feature toggling on collection, by instructor preference
    vm.view = 'releases';
    vm.utils = new Utilities();

    //functions
    vm.goBackToReleases = goBackToReleases;
    vm.goBackToAttempts = goBackToAttempts;
    vm.isAttemptsView = isAttemptsView;
    vm.viewAttempts = viewAttempts;
    vm.viewResponses = viewResponses;

    //when going back from attempts view
    function goBackToReleases() {
        vm.view = 'releases';
        vm.utils.setLtiHeight();
    }

    //when going back from the responses view
    function goBackToAttempts() {
        vm.view = 'attempts';
        vm.utils.setLtiHeight();
    }

    function isAttemptsView() {
        if (vm.view === 'attempts') {
            return true;
        }

        return false;
    }

    //when clicking on an assessment off of the release list
    function viewAttempts($event) {
        var assessment = $event.assessment;
        vm.attemptAssessment = assessment;
        vm.view = 'attempts';
        vm.utils.loadingStarted();
        Manage.getStudentAttempts(assessment.id, vm.utils.contextId)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.displayedAttempts = data.attempts;
                vm.showResponses = data.showResponses;
                vm.questions = data.questions;
                vm.courseContext = data.courseContext;
                vm.utils.loadingFinished();
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function viewResponses($event) {
        var attempt = $event.attempt;
        vm.responseAttempt = attempt;
        vm.responses = attempt.student_responses;
        vm.view = 'responses';
        vm.utils.focusToElement('#response-header');
        vm.utils.setLtiHeight();
    }
}