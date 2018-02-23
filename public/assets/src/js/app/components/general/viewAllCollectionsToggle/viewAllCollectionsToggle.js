app.component('qcViewAllCollectionsToggle', {
    controller: QcViewAllCollectionsToggleController,
    controllerAs: 'vm',
    bindings: {
        utils: '=qcUtils',
        collectionData: '=qcCollectionData'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('viewAllCollectionsToggleTemplate.html');
    }]
});

QcViewAllCollectionsToggleController.$inject = ['$rootScope', 'Collection'];

function QcViewAllCollectionsToggleController($rootScope, Collection) {
    var vm = this;
    //because this could be a data-intensive operation if there are many collections, just
    //run once; don't allow user to toggle a million times
    vm.previousRequestMade = false;
    vm.getAllCollections = getAllCollections;
    vm.toggleViewAll = toggleViewAll;

    function toggleViewAll() {
        vm.collectionData.viewAll = !vm.collectionData.viewAll;
        if (vm.collectionData.viewAll && !vm.previousRequestMade) {
            vm.getAllCollections();
        }
    }

    function getAllCollections() {
        vm.utils.loadingStarted();
        Collection.getCollectionsWithAssessments().then(function(resp) {
            var data = vm.utils.getResponseData(resp);
            vm.collectionData.collections = data.collections;
            vm.utils.loadingFinished();
            vm.previousRequestMade = true;
        }, function(resp) {
            vm.utils.showError(resp);
        });
    }
}