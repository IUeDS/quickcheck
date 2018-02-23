app.component('qcAttemptsOverview', {
    controller: AttemptsOverviewController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('attemptsOverviewContainerTemplate.html');
    }]
});

AttemptsOverviewController.$inject = ['Manage', 'Utilities'];

function AttemptsOverviewController(Manage, Utilities) {
    var vm = this;

    //functions
    vm.$onInit = $onInit;
    vm.getStudents = getStudents;
    vm.isSubstringNotFound = isSubstringNotFound;
    vm.isViewingByStudent = isViewingByStudent;
    vm.toggleStudentResultsView = toggleStudentResultsView;

    //variables
    vm.attempts = [];
    vm.currentPage = 'results';
    vm.isResultsByStudentToggled = false;
    vm.search = {
        'assessmentName': '',
        'studentName': ''
    };
    vm.students = [];
    vm.utils = new Utilities();

    function $onInit() {
        vm.utils.loadingStarted();
        Manage.getOverview(vm.utils.contextId)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                //attempts are grouped by unique assessment id, so we're not getting ALL attempts;
                //each attempt comes with the unique assessment, for us to put onto the page
                vm.attempts = data.attempts;
                vm.utils.loadingFinished();
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function getStudents() {
        vm.utils.loadingStarted();
        Manage.getStudentsByContext(vm.utils.contextId).then(function(resp) {
            var data = vm.utils.getResponseData(resp);
            vm.students = data.students;
            vm.utils.loadingFinished();
        }, function(resp) {
            vm.utils.showError(resp);
        });
    }

    function isSubstringNotFound(string1, string2) {
        if (string1.toLowerCase().indexOf(string2.toLowerCase()) === -1) {
            return true;
        }
        else {
            return false;
        }
    }

    function isViewingByStudent() {
        if (vm.isResultsByStudentToggled == 'true') {
            return true;
        }

        return false;
    }

    function toggleStudentResultsView() {
        if (vm.isResultsByStudentToggled == 'true') {
            vm.isResultsByStudentToggled = 'false';
            return;
        }

        vm.isResultsByStudentToggled = 'true';
        //only fetch students once, cache in memory afterward
        if (vm.students.length) {
            return;
        }

        vm.getStudents();
    }
}