app.component('qcCustomActivitySelection', {
    controller: CustomActivitySelectionController,
    controllerAs: 'vm',
    bindings: {
        admin: '<qcAdmin',
        assessment: '=qcAssessment',
        customActivity: '<qcCustomActivity',
        customActivityAdded: '=qcCustomActivityAdded',
        readOnly: '<qcReadOnly',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('customActivitySelectionTemplate.html');
    }]
});

CustomActivitySelectionController.$inject = ['CustomActivity'];

function CustomActivitySelectionController(CustomActivity) {
    var vm = this;

    vm.customActivities = [];

    vm.$onInit = $onInit;
    vm.addCustomActivity = addCustomActivity;
    vm.getCustomActivities = getCustomActivities;
    vm.removeCustomActivity = removeCustomActivity;
    vm.selectCustomActivity = selectCustomActivity;

    function $onInit() {
        vm.utils.setLtiHeight();
        if (!vm.admin) {
            return;
        }

        //admins can select custom activity from list; instructor can only view
        //what has already been selected by an admin
        vm.getCustomActivities();
    }

    function addCustomActivity() {
        vm.customActivityAdded = true;
        //if user saved and is adding/editing more data, remove the success box
        vm.saved = false;
    }

    function getCustomActivities() {
        CustomActivity.getCustomActivities()
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.customActivities = data.customActivities;
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function removeCustomActivity() {
        vm.customActivityAdded = false;
        delete vm.assessment.custom_activity_id;
        //if user saved and is adding/editing more data, remove the success box
        vm.saved = false;
    }

    //populate the url/developer info whenever a custom activity option is selected, to give user more info
    function selectCustomActivity(id) {
        vm.customActivities.forEach(function(activity) {
            if (activity.id == id) {
                vm.customActivity = activity;
                //if user saved and is adding/editing more data, remove the success box
                vm.saved = false;
            }
        });
    }
}