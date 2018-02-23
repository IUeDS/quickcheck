app.component('qcAddCustomActivity', {
    controller: AddCustomActivityController,
    controllerAs: 'vm',
    bindings: {
        onSave: '&qcOnSave',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('addCustomActivityTemplate.html');
    }]
});

AddCustomActivityController.$inject = ['CustomActivity'];

function AddCustomActivityController(CustomActivity) {
    var vm = this;

    vm.customActivityData = {};
    vm.isOpen = false;

    vm.closeForm = closeForm;
    vm.openForm = openForm;
    vm.save = save;

    function closeForm() {
        vm.isOpen = false;
        vm.customActivityData = {}; //reset
    }

    function openForm() {
        vm.isOpen = true;
    }

    function save() {
        vm.utils.loadingStarted();
        CustomActivity.createCustom(vm.customActivityData)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp),
                    customActivity = data.customActivity;

                vm.utils.loadingFinished();
                vm.closeForm();
                //notify parent to add to list
                vm.onSave({
                    $event: {
                        customActivity: customActivity
                    }
                });
            }, function (resp) {
                vm.utils.showError(resp);
            });
    }
}
