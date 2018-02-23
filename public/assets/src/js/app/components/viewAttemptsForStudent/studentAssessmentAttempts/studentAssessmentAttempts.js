app.component('qcStudentAssessmentAttempts', {
    controller: StudentAssessmentAttemptsController,
    controllerAs: 'vm',
    bindings: {
        assessment: '<qcAssessmentWithAttempts',
        courseContext: '<qcCourseContext',
        studentId: '<qcStudentId',
        user: '<qcUser',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('studentAssessmentAttemptsTemplate.html');
    }]
});

StudentAssessmentAttemptsController.$inject = ['Manage'];

function StudentAssessmentAttemptsController(Manage) {
    var vm = this;

    vm.attempts = [];
    vm.accordionClosed = true;
    vm.dueAt = false;
    vm.gradesLoading = true;
    vm.pointsPossible = null;
    vm.questions = [];
    vm.responseAttempt = null;
    vm.responseViewVisible = false;
    vm.studentResponses = [];
    vm.submission = null;
    vm.timezone = null;

    vm.$onInit = $onInit;
    vm.getDueAt = getDueAt;
    vm.hideResponses = hideResponses;
    vm.isAccordionClosed = isAccordionClosed;
    vm.loadGrade = loadGrade;
    vm.toggleAccordion = toggleAccordion;
    vm.viewResponses = viewResponses;

    function $onInit() {
        vm.attempts = vm.assessment.attempts;
        vm.utils.setLtiHeight();
    }

    function getDueAt() {
        var dueAt,
            dueAtInTimezone;

        vm.timezone = vm.courseContext.time_zone;
        dueAt = vm.attempts[0].due_at;
        if (!dueAt || dueAt == 0) {
            return false;
        }

        dueAtInTimezone = vm.utils.convertTimeWithTimezone(dueAt, vm.timezone, true);
        vm.dueAt = vm.utils.formatTimeWithTimeZone(dueAtInTimezone, vm.timezone);
    }

    function hideResponses() {
        vm.responseViewVisible = false;
        vm.utils.setLtiHeight();
    }

    function isAccordionClosed() {
        if (vm.accordionClosed) {
            return true;
        }

        return false;
    }

    function loadGrade() {
        Manage.getStudentSubmission(vm.assessment.id, vm.utils.contextId, vm.studentId).then(function(resp) {
            var data = vm.utils.getResponseData(resp);
            //submission and pointsPossible not included if not embedded in a graded assignment
            if (data.assignment) {
                vm.submission = data.submission;
                vm.pointsPossible = data.assignment.points_possible;
                vm.getDueAt();
            }
            vm.gradesLoading = false;
        }, function(resp) {
            vm.utils.showError(resp);
        });
    }

    function toggleAccordion() {
        vm.accordionClosed = !vm.accordionClosed;
        vm.utils.setLtiHeight();

        if (!vm.gradesLoading) {
            return;
        }

        //load grades once, the first time the accordion is opened
        vm.loadGrade();
    }

    function viewResponses($event) {
        var attempt = $event.attempt;
        Manage.getStudentResponses(attempt.id)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.responseAttempt = attempt;
                vm.studentResponses = data.responses;
                vm.questions = data.questions;
                vm.responseViewVisible = true;
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }
}