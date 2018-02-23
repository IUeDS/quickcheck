app.component('qcCustomActivity', {
    controller: CustomActivityController,
    controllerAs: 'vm',
    bindings: {
        customActivity: '<qcCustomActivityData',
        index: '<qcIndex',
        onDelete: '&qcOnDelete',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('customActivityTemplate.html');
    }]
});

CustomActivityController.$inject = ['CustomActivity'];

function CustomActivityController(CustomActivity) {
    var vm = this;

    vm.editingData = {}; //copy to separate object so if user cancels edit, data is intact
    vm.isEditing = false;

    vm.$onInit = $onInit;
    vm.cancelEdit = cancelEdit;
    vm.confirmDelete = confirmDelete;
    vm.deleteCustomActivity = deleteCustomActivity;
    vm.edit = edit;
    vm.isGroupRequired = isGroupRequired;
    vm.stopAccordion = stopAccordion;
    vm.toggleAccordion = toggleAccordion;
    vm.toggleCustomGroupRequired = toggleCustomGroupRequired;
    vm.update = update;

    function $onInit() {
        //accordion closed by default
        vm.customActivity.closed = true;
        vm.utils.setLtiHeight();
    }

    function cancelEdit() {
        vm.isEditing = false;
    }

    function confirmDelete() {
        //don't use confirm alert in regression testing, it blows up protractor
        if (vm.utils.isRegressionEnv()) {
            return true;
        }

        return confirm('Are you sure you want to delete this custom activity?');
    }

    function deleteCustomActivity($event) {
        vm.stopAccordion($event); //prevent accordion from getting toggled by button click
        if (!vm.confirmDelete()) {
            return false;
        }

        vm.utils.loadingStarted();

        CustomActivity.deleteCustom(vm.customActivity.id)
            .then(function (resp) {
                vm.utils.loadingFinished();
                //notify parent that activity was deleted
                vm.onDelete({
                    $event: {
                        customActivityIndex: vm.index
                    }
                });
            }, function (resp) {
                vm.utils.showError(resp);
            });
    }

    function edit($event) {
        //prevent accordion from getting toggled by button click if already open
        if (!vm.customActivity.closed) {
            vm.stopAccordion($event);
        }
        //copy model, in case user makes updates and then cancels, so that existing model doesn't change on the page
        vm.editingData = {};
        angular.copy(vm.customActivity, vm.editingData);
        vm.isEditing = true;
    }

    function isGroupRequired() {
        if (vm.customActivity.group_required == 'true') {
            return true;
        }

        return false;
    }

    function stopAccordion($event) {
        $event.stopPropagation();
    }

    function toggleAccordion() {
        vm.customActivity.closed = !vm.customActivity.closed;
        vm.utils.setLtiHeight();
    }

    function toggleCustomGroupRequired() {
        if (vm.editingData.group_required == 'true') {
            vm.editingData.group_required = 'false';
        }
        else {
            vm.editingData.group_required = 'true';
        }
    }

    function update() {
        vm.utils.loadingStarted();
        CustomActivity.updateCustom(vm.customActivity.id, vm.editingData)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.customActivity = data.customActivity;
                vm.cancelEdit(); //close form
                vm.utils.loadingFinished();
            }, function (resp) {
                vm.utils.showError(resp);
            });
    }
}
