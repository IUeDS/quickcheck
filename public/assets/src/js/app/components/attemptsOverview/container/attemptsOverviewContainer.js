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
    vm.getAssessments = getAssessments;
    vm.getStudents = getStudents;
    vm.isResultsByStudentToggleEnabled = isResultsByStudentToggleEnabled;
    vm.isSubstringNotFound = isSubstringNotFound;
    vm.isViewingByStudent = isViewingByStudent;
    vm.storageAvailable = storageAvailable;
    vm.toggleStudentResultsView = toggleStudentResultsView;

    //variables
    vm.attempts = [];
    vm.currentPage = 'results';
    vm.isResultsByStudentToggled = false;
    vm.sessionStorageKey = 'iu-eds-quickcheck-student-results-toggle';
    vm.search = {
        'assessmentName': '',
        'studentName': ''
    };
    vm.students = [];
    vm.utils = new Utilities();
    
    function $onInit() {
        if (vm.isResultsByStudentToggleEnabled()) {
            vm.isResultsByStudentToggled = 'true';
            vm.getStudents();
        }
        else {
            vm.getAssessments();
        }
    }

    function getAssessments() {
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

    function isResultsByStudentToggleEnabled() {
        if (!vm.storageAvailable('sessionStorage')) {
            return false;
        }

        return JSON.parse(sessionStorage.getItem(vm.sessionStorageKey));
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

    //determine if local storage is available
    //source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    function storageAvailable(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    }

    function toggleStudentResultsView() {
        if (vm.isResultsByStudentToggled == 'true') {
            vm.isResultsByStudentToggled = 'false';

            if (vm.storageAvailable('sessionStorage')) {
                sessionStorage.setItem(vm.sessionStorageKey, false);
            }

            if (vm.attempts.length) {
                return;
            }

            vm.getAssessments();

            return;
        }

        vm.isResultsByStudentToggled = 'true';

        if (vm.storageAvailable('sessionStorage')) {
            sessionStorage.setItem(vm.sessionStorageKey, true);
        }

        //only fetch students once, cache in memory afterward
        if (vm.students.length) {
            return;
        }        

        vm.getStudents();

        return;

    }
}