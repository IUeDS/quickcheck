app.component('qcViewAttemptsForStudent', {
    controller: ViewAttemptsForStudentController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('viewAttemptsForStudentContainerTemplate.html');
    }]
});

ViewAttemptsForStudentController.$inject = ['$location', 'Manage', 'Submission', 'Utilities'];

function ViewAttemptsForStudentController($location, Manage, Submission, Utilities) {
    var vm = this;

    vm.analyticsViewVisible = false;
    vm.assessmentsWithAttempts = [];
    vm.courseContext = null;
    vm.currentPage = 'results';
    vm.displayedAssessments = []; //those shown to user (after filters, etc.)
    vm.studentId = null;
    vm.studentName = null;
    vm.user = null;
    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.getStudentIdFromUrl = getStudentIdFromUrl;
    vm.getStudentName = getStudentName;
    vm.isAttemptsView = isAttemptsView;
    vm.isSubstringFound = isSubstringFound;
    vm.searchAssessmentName = searchAssessmentName;
    vm.toggleAnalytics = toggleAnalytics;

    function $onInit() {
        vm.utils.loadingStarted();
        vm.studentId = vm.getStudentIdFromUrl();
        Manage.getAttemptsForStudent(vm.utils.contextId, vm.studentId).then(function(resp) {
            var data = vm.utils.getResponseData(resp);
            vm.courseContext = data.courseContext;
            vm.user = data.user;
            vm.assessmentsWithAttempts = data.assessmentsWithAttempts;
            vm.displayedAssessments = vm.assessmentsWithAttempts; //default show all
            vm.studentName = vm.getStudentName();
            vm.utils.loadingFinished();
        }, function(resp) {
            vm.utils.showError(resp);
        });
    }

    function getStudentIdFromUrl() {
        var url = $location.url(),
            splitUrl = url.split('/student/'),
            idSplit = splitUrl[1].split('/'),
            studentId = idSplit[0];

        return studentId;
    }

    function getStudentName() {
        //user from Canvas is in an array keyed by user ID to be consistent across components
        var userId = Object.keys(vm.user)[0];
        return vm.user[userId].name;
    }

    function isAttemptsView() {
        if (!vm.analyticsViewVisible) {
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

    function searchAssessmentName() {
        vm.displayedAssessments = vm.assessmentsWithAttempts.filter(function(assessment) {
            if (vm.isSubstringFound(assessment.name, vm.search.assessmentName)) {
                return true;
            }
        });
    }

    function toggleAnalytics() {
        vm.analyticsViewVisible = !vm.analyticsViewVisible;
    }
}