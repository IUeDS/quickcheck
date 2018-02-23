app.component('qcAddAssessmentGroup', {
    controller: AddAssessmentGroupController,
    controllerAs: 'vm',
    bindings: {
        collectionId: '<qcCollectionId',
        onSave: '&qcOnSave',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('addAssessmentGroupTemplate.html');
    }]
});

AddAssessmentGroupController.$inject = ['Collection'];

function AddAssessmentGroupController(Collection) {
    var vm = this;

    vm.formOpen = false;
    vm.newAssessmentGroup = null;

    vm.cancel = cancel;
    vm.openForm = openForm;
    vm.onSaveComplete = onSaveComplete;
    vm.save = save;

    function cancel() {
        vm.formOpen = false;
        vm.utils.setLtiHeight();
    }

    function onSaveComplete(newAssessmentGroup) {
        //pass event up to parent, to add assessment group to the page
        vm.onSave({
            $event: {
                newAssessmentGroup: newAssessmentGroup
            }
        });
    }

    function openForm() {
        vm.formOpen = true;
        vm.newAssessmentGroup = {};

        //move focus to appropriate header to orient screenreader users
        vm.utils.focusToElement('#create-assessmentgroup-header');
        vm.utils.setLtiHeight();
    }

    function save() {
        vm.newAssessmentGroup.collection_id = vm.collectionId;
        vm.utils.loadingStarted();

        Collection.createAssessmentGroup(vm.newAssessmentGroup)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.onSaveComplete(data.assessmentGroup);
                vm.formOpen = false;
                vm.newAssessmentGroup = {};
                vm.utils.loadingFinished();
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }
}