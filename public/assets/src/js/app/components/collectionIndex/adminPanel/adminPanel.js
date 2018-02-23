app.component('qcAdminPanel', {
    controller: QcAdminPanelController,
    controllerAs: 'vm',
    bindings: {
        collectionData: '=qcCollectionData',
        utils: '=qcUtils',
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('adminPanelTemplate.html');
    }]
});

function QcAdminPanelController() {
    var vm = this;

    vm.$onInit = $onInit;

    function $onInit() {
        vm.utils.setLtiHeight();
    }
}