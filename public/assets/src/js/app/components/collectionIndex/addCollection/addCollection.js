app.component('qcAddCollection', {
    controller: AddCollectionController,
    controllerAs: 'vm',
    bindings: {
        onSave: '&qcOnSave',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('addCollectionTemplate.html');
    }]
});

AddCollectionController.$inject = ['Collection'];

function AddCollectionController(Collection) {
    var vm = this;

    vm.isAddingCollection = false;
    vm.newCollection = {};

    vm.addCollection = addCollection;
    vm.collectionAddClose = collectionAddClose;
    vm.saveNewCollection = saveNewCollection;

    function addCollection() {
        vm.isAddingCollection = true;
        vm.utils.setLtiHeight();
        vm.utils.focusToElement('#collection-name');
    }

    function collectionAddClose() {
        vm.isAddingCollection = false;
    }

    function saveNewCollection() {
        vm.utils.loadingStarted();
        Collection.createCollection(vm.newCollection)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp),
                    membership = data.membership;

                vm.isAddingCollection = false;

                //notify parent to add to list of memberships
                vm.onSave({
                    $event: {
                        membership: membership
                    }
                });

            }, function (resp) {
                vm.utils.showError(resp);
            });
    }
}