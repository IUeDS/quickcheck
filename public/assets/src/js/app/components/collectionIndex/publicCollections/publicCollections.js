app.component('qcPublicCollections', {
    controller: PublicCollectionsController,
    controllerAs: 'vm',
    bindings: {
        user: '<qcUser',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('publicCollectionsTemplate.html');
    }]
});

PublicCollectionsController.$inject = ['Collection', 'User'];

function PublicCollectionsController(Collection, User) {
    var vm = this;

    vm.publicCollections = false;

    vm.$onInit = $onInit;
    vm.joinPublicCollection = joinPublicCollection;
    vm.optOutPublicCollection = optOutPublicCollection;

    function $onInit() {
        Collection.getPublicCollections()
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.publicCollections = data.publicCollections;
            }, function (resp) {
                vm.utils.showError(resp);
            });
    }

    function joinPublicCollection(collection) {
        vm.utils.loadingStarted();
        User.joinPublicCollection(collection.id, vm.user)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                collection.user_membership = data.membership;
                var focusElement = '#goto-collection-' + collection.id;
                vm.utils.loadingFinished(focusElement);
            }, function (resp) {
                vm.utils.showError(resp);
            });
    }

    function optOutPublicCollection(collection) {
        vm.utils.loadingStarted();
        User.optOutPublicCollection(collection.id, vm.user)
            .then(function (resp) {
                vm.utils.loadingFinished();
                collection.user_membership = false;
            }, function (resp) {
                vm.utils.showError(resp);
            });
    }
}