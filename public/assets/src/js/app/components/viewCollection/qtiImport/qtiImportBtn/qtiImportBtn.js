app.component('qcQtiImportBtn', {
    controller: QtiImportBtnController,
    controllerAs: 'vm',
    bindings: {
        isImportingQti: '=qcIsImportingQti'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('qtiImportBtnTemplate.html');
    }]
});

function QtiImportBtnController () {
    var vm = this;

    vm.initQtiImport = initQtiImport;

    function initQtiImport() {
        vm.isImportingQti = true;
    }
}