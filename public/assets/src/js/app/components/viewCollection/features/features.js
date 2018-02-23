app.component('qcFeatures', {
    controller: FeaturesController,
    controllerAs: 'vm',
    bindings: {
        collectionId: '<qcCollectionId',
        readOnly: '<qcReadOnly',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('featuresTemplate.html');
    }]
});

FeaturesController.$inject = ['Collection'];

function FeaturesController(Collection) {
    var vm = this;

    vm.collectionFeatures = [];
    vm.showFeatures = false;

    vm.$onInit = $onInit;
    vm.toggleFeature = toggleFeature;
    vm.toggleShowFeatures = toggleShowFeatures;

    function $onInit() {
        Collection.getCollectionFeatures(vm.collectionId)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.collectionFeatures = data.features;
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function toggleShowFeatures() {
        vm.showFeatures = !vm.showFeatures;
        vm.utils.setLtiHeight();
    }

    function toggleFeature(collectionFeature) {
        if (collectionFeature.enabled == 'true') {
            collectionFeature.enabled = 'false';
        } else {
            collectionFeature.enabled = 'true';
        }
        collectionFeature.loading = true; //disable input while saving
        Collection.updateFeature(collectionFeature.id, { 'collectionFeature': collectionFeature })
            .then(function(resp) {
                collectionFeature.loading = false;
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }
}