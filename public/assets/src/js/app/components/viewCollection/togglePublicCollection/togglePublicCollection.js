app.component('qcTogglePublicCollection', {
    controller: TogglePublicCollectionController,
    controllerAs: 'vm',
    bindings: {
        collection: '=qcCollection',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('togglePublicCollectionTemplate.html');
    }]
});

TogglePublicCollectionController.$inject = ['Collection'];

function TogglePublicCollectionController (Collection) {
    var vm = this;

    vm.confirmToggle = confirmToggle;
    vm.isPublicCollection = isPublicCollection;
    vm.setPrivate = setPrivate;
    vm.setPublic = setPublic;
    vm.togglePublicCollection = togglePublicCollection;
    vm.updateCollection = updateCollection;

    function confirmToggle() {
        var msg = '';

        //prevent Protractor from freaking out from js alerts by accepting in regression env
        if (vm.utils.isRegressionEnv()) {
            return true;
        }
        else if (vm.isPublicCollection()) {
            msg = 'Are you sure you want this set to no longer be public? If users ' +
                'have already embedded quick checks from this collection, they will ' +
                'still be available. Future embeds will be disabled.';
            return confirm(msg);
        }
        else {
            msg = 'Are you sure you want to make this set public? All users in ' +
                'the system will be able to embed quick checks that are in this set.';
            return confirm(msg);
        }
    }

    function isPublicCollection() {
        if (vm.collection.public_collection === 'true') {
            return true;
        }

        return false;
    }

    function setPrivate() {
        vm.collection.public_collection = 'false';
    }

    function setPublic() {
        vm.collection.public_collection = 'true';
    }

    function togglePublicCollection() {
        if (!vm.confirmToggle()) {
            return;
        }

        if (vm.isPublicCollection()) {
            vm.setPrivate();
        }
        else {
            vm.setPublic();
        }

        vm.updateCollection();
    }

    function updateCollection() {
        Collection.togglePublic(vm.collection)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.collection = data.collection;
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }
}