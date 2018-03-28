app.component('qcUsers', {
    controller: UsersController,
    controllerAs: 'vm',
    bindings: {
        collectionId: '<qcCollectionId',
        currentUser: '<qcCurrentUser',
        readOnly: '<qcReadOnly',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('usersTemplate.html');
    }]
});

UsersController.$inject = ['Collection', 'User'];

function UsersController(Collection, User) {

    var vm = this;

    vm.collectionUsers = [];
    vm.isAddingUser = {};
    vm.isEditingUsers = {};
    vm.showUsers = false;

    vm.$onInit = $onInit;
    vm.addUserCancel = addUserCancel;
    vm.deleteMembership = deleteMembership;
    vm.editUsersCancel = editUsersCancel;
    vm.getCollectionUsers = getCollectionUsers;
    vm.isAddingUserInit = isAddingUserInit;
    vm.isEditingUsersInit = isEditingUsersInit;
    vm.saveUserEdits = saveUserEdits;
    vm.saveUserMembership = saveUserMembership;
    vm.toggleReadOnly = toggleReadOnly;
    vm.toggleShowUsers = toggleShowUsers;
    vm.validateUser = validateUser;

    function $onInit() {
        vm.getCollectionUsers();
    }

    function addUserCancel() {
        vm.isAddingUser = {};
    }

    function deleteMembership(user) {
        user.deleted = true;
    }

    function editUsersCancel() {
        vm.isEditingUsers = {}; //reset
    }

    function getCollectionUsers() {
        Collection.getCollectionMembership(vm.collectionId)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.collectionUsers = data.users;
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function isAddingUserInit() {
        vm.isAddingUser = {}; //reset
        vm.isEditingUsers = {}; //reset to hide success box, if visible
        vm.isAddingUser.init = true;
        vm.isAddingUser.checkUser = true;

        //move focus to appropriate header to orient screenreader users
        vm.utils.focusToElement('#invite-user-header');
    }

    function isEditingUsersInit() {
        vm.isEditingUsers = {}; //reset
        vm.isEditingUsers.init = true;
        vm.isEditingUsers.users = [];
        angular.copy(vm.collectionUsers, vm.isEditingUsers.users);
        //move focus to appropriate header to orient screenreader users
        vm.utils.focusToElement('#edit-users-header');
    }


    function saveUserEdits() {
        vm.isEditingUsers.loading = true;
        vm.isEditingUsers.init = false;

        Collection.updateCollectionMembership(vm.collectionId, vm.isEditingUsers)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.isEditingUsers.loading = false;
                vm.collectionUsers = data.users;
                vm.isEditingUsers.success = true;
            }, function(resp) {
                vm.isEditingUsers.loading = false;
                vm.isEditingUsers.error = true;
                vm.isEditingUsers.init = true; //show editing view again so they can redo
            });
    }

    function saveUserMembership() {
        var membershipData = {
            'username': vm.isAddingUser.username,
            'collectionId': vm.collectionId,
            'readOnly': vm.isAddingUser.readOnly
        };
        vm.isAddingUser.saveError = false;

        Collection.createMembership(membershipData)
            .then(function(resp) {
                vm.isAddingUser.userAdded = true;
                vm.getCollectionUsers();
            }, function(resp) {
                vm.isAddingUser.saveError = true;
                vm.isAddingUser.saveErrorReason = vm.utils.getError(resp);
            });
    }

    function toggleReadOnly(user) {
        if (user.readOnly == 'true') {
            user.readOnly = null;
        } else {
            user.readOnly = 'true';
        }
    }

    function toggleShowUsers() {
        vm.showUsers = !(vm.showUsers);
        vm.utils.setLtiHeight();
    }

    function validateUser() {
        var user = { 'username': vm.isAddingUser.username };

        vm.isAddingUser.validationError = false;
        User.validateUser(user)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                if (vm.utils.isSuccessResponse(resp)) {
                    vm.isAddingUser.validatedUser = data.user;
                    vm.isAddingUser.checkUser = false;
                    vm.isAddingUser.userValidated = true;
                    vm.saveUserMembership();
                }
                else {
                    vm.isAddingUser.validationError = true;
                }
            }, function(resp) {
                vm.isAddingUser.validationError = true;
            });
    }
}
