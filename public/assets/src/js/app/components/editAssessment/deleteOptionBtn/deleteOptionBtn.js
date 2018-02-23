app.component('qcDeleteOptionBtn', {
    controller: DeleteOptionBtnController,
    controllerAs: 'vm',
    bindings: {
        index: '<qcIndex',
        onDelete: '&qcOnDelete',
        option: '<qcOption',
        optionTypeText: '<qcOptionTypeText',
        question: '<qcQuestion'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('deleteOptionBtnTemplate.html');
    }]
});

function DeleteOptionBtnController() {
    var vm = this;
    vm.deleteOption = deleteOption;

    function deleteOption() {
        vm.onDelete({
            $event: {
                'option': vm.option,
                'index': vm.index
            }
        });
    }
}