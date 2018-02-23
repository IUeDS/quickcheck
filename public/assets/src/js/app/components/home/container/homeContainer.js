app.component('qcHome', {
    controller: HomeController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('homeContainerTemplate.html');
    }]
});

HomeController.$inject = ['Utilities'];

function HomeController(Utilities) {
    var vm = this;

    //variables
    vm.currentPage = 'home';
    vm.isAddingAssessment = false;
    vm.sessionExpired = false;
    vm.utils = new Utilities();

    //functions
    vm.$onInit = $onInit;
    vm.addAssessment = addAssessment;
    vm.cancelAdd = cancelAdd;
    vm.checkForExpiredSession = checkForExpiredSession;

    function $onInit() {
        vm.checkForExpiredSession();

        if (!vm.utils.areCookiesEnabled()) {
            var errorMessage = vm.utils.getCookieErrorMsg();
            vm.utils.setError(errorMessage);
        }
    }

    function addAssessment() {
        vm.isAddingAssessment = true;
    }

    function cancelAdd() {
        vm.isAddingAssessment = false;
    }

    //if the user ran an API call that resulted in an expired session warning from the back-end, then
    //they are redirected to the home page with a query param set to let us know to show an expired
    //session warning
    function checkForExpiredSession() {
        vm.sessionExpired = vm.utils.getUrlQueryParameter('sessionexpired');
    }
}