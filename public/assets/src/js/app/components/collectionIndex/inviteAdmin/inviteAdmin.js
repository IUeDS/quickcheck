app.component('qcInviteAdmin', {
    controller: InviteAdminController,
    controllerAs: 'vm',
    bindings: {
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('inviteAdminTemplate.html');
    }]
});

InviteAdminController.$inject = ['User'];

function InviteAdminController(User) {
    var vm = this;

    vm.isEnteringUsername = false;
    vm.formOpen = false;
    vm.username = null;
    vm.validationError = false;
    vm.saveError = false;
    vm.saveErrorReason = null;
    vm.userAdded = false;
    vm.userValidated = false;
    vm.validatedUser = null;

    vm.close = close;
    vm.openForm = openForm;
    vm.reset = reset;
    vm.saveUser = saveUser;
    vm.validateUser = validateUser;

    function close() {
        vm.formOpen = false;
    }

    function openForm() {
        vm.reset();
        vm.formOpen = true;
    }

    function reset() {
        vm.username = null;
        vm.validationError = false;
        vm.saveError = false;
        vm.userValidated = false;
        vm.userAdded = false;
        vm.userLdapInfo = null;
        vm.isEnteringUsername = true;
    }

    function saveUser() {
        var user = {'username': vm.username};
        vm.saveError = false; //reset if set previously

        User.addAdmin(user)
            .then(function (resp) {
                vm.userAdded = true;
                vm.utils.loadingFinished();
            }, function (resp) {
                vm.saveErrorReason = vm.utils.getError(resp);
                vm.saveError = true;
                vm.utils.loadingFinished();
            });
    }

    function validateUser() {
        var user = {'username': vm.username};
        vm.utils.loadingStarted();
        vm.validationError = false; //reset if set previously
        User.validateUser(user)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                if (vm.utils.isSuccessResponse(resp)) {
                    vm.validatedUser = data.user;
                    vm.userValidated = true;
                    vm.saveUser();
                }
                else {
                    vm.validationError = true;
                    vm.utils.loadingFinished();
                }

            }, function (resp) {
                vm.validationError = true;
                vm.utils.loadingFinished();
            });
    }
}
