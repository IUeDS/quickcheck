app.component('qcQtiExportBtn', {
    controller: QtiExportBtnController,
    controllerAs: 'vm',
    bindings: {
        isExportingQti: '=qcIsExportingQti'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('qtiExportBtnTemplate.html');
    }]
});

function QtiExportBtnController () {
    var vm = this;

    vm.initQtiExport = initQtiExport;

    function initQtiExport() {
        vm.isExportingQti = true;
    }
}