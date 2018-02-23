app.component('qcCustomActivitiesPanel', {
    controller: CustomActivitiesPanelController,
    controllerAs: 'vm',
    bindings: {
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('customActivitiesPanelTemplate.html');
    }]
});

CustomActivitiesPanelController.$inject = ['CustomActivity'];

function CustomActivitiesPanelController(CustomActivity) {
    var vm = this;

    vm.customActivities = [];
    vm.isOpen = false;
    vm.loading = false;

    vm.close = close;
    vm.onDelete = onDelete;
    vm.onSave = onSave;
    vm.open = open;

    function close() {
        vm.isOpen = false;
    }

    function onDelete($event) {
        var customActivityIndex = $event.customActivityIndex;
        vm.customActivities.splice(customActivityIndex, 1);
    }

    function onSave($event) {
        var customActivity = $event.customActivity;
        vm.customActivities.push(customActivity);
        vm.utils.focusToElement('#qc-custom-activity-' + customActivity.id);
    }

    function open() {
        vm.loading = true;
        vm.isOpen = true;
        CustomActivity.getCustomActivities()
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.customActivities = data.customActivities;
                vm.loading = false;
            }, function (resp) {
                vm.utils.showError(resp);
            });
    }
}