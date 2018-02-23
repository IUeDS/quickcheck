app.component('qcNav', {
    controller: QcNavController,
    controllerAs: 'vm',
    bindings: {
        'currentPage': '<qcCurrentPage'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('navTemplate.html');
    }]
});

QcNavController.$inject = ['Utilities'];

function QcNavController(Utilities) {
    var vm = this;

    vm.utils = new Utilities();
    vm.utils.checkForLti();
}