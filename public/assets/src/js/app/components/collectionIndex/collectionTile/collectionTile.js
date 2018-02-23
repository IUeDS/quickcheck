app.component('qcCollectionTile', {
    controller: QcCollectionTileController,
    controllerAs: 'vm',
    bindings: {
        collection: '=qcCollection',
        index: '=qcIndex',
        utils: '=qcUtils',
        membership: '=?qcMembership'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('collectionTileTemplate.html');
    }]
});

QcCollectionTileController.$inject = ['$rootScope', 'Collection'];

function QcCollectionTileController($rootScope, Collection) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.collectionEditingClose = collectionEditingClose;
    vm.deleteCollection = deleteCollection;
    vm.editCollection = editCollection;
    vm.updateCollection = updateCollection;

    function $onInit() {
        vm.utils.setLtiHeight();
    }

    function editCollection () {
        //copy model, in case user makes updates and then cancels, so that existing model doesn't change on the page
        var editingData = {};
        angular.copy(vm.collection, editingData);
        vm.collection.editingData = editingData;
        vm.collection.isEditing = true;

        //focus on header to orient screenreader user to the proper location
        var element = '#edit-collection-header-' + vm.collection.id;
        vm.utils.focusToElement(element);
    }

    function collectionEditingClose () {
        vm.collection.isEditing = false;
    }

    function deleteCollection() {
        if (confirm('Are you sure you want to delete this set and all quick checks associated with it? This action cannot be undone.')) {
            vm.utils.loadingStarted();
            Collection.deleteCollection(vm.collection.id)
                .then(function (resp) {
                    vm.collection = null; //triggers ng-if on directive to remove DOM element
                    vm.utils.loadingFinished();
                }, function (resp) {
                    vm.utils.showError(resp);
                });
        }
    }

    function updateCollection() {
        vm.utils.loadingStarted();
        Collection.updateCollection(vm.collection.id, vm.collection.editingData)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.collection = data.collection;
                var focusElement = '#collection-header-' + data.collection.id;
                vm.utils.loadingFinished();
            }, function (resp) {
                vm.utils.showError(resp);
            });
    }
}