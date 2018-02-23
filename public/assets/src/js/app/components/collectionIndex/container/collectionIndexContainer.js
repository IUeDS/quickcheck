app.component('qcCollectionIndex', {
    controller: CollectionIndexController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('collectionIndexContainerTemplate.html');
    }]
});

CollectionIndexController.$inject = ['Collection', 'User', 'Utilities'];

function CollectionIndexController(Collection, User, Utilities) {
    var vm = this;

    //variables
    vm.admin = false;
    vm.adminCollectionData = {
        'viewAll': false,
        'collections': []
    };
    vm.currentPage = 'sets';
    vm.memberships = [];
    vm.publicCollectionsVisible = false;
    vm.search = {'collectionName': ''}; //for searching in collection list
    vm.user = {};
    vm.utils = new Utilities();

    //functions
    vm.$onInit = $onInit;
    vm.getCollections = getCollections;
    vm.getUser = getUser;
    vm.isSubstringNotFound = isSubstringNotFound;
    vm.onCollectionAdded = onCollectionAdded;
    vm.togglePublicCollectionVisibility = togglePublicCollectionVisibility;

    function $onInit() {
        vm.getCollections();
    }

    function getCollections(focusToCollectionElement) {
        vm.utils.loadingStarted();
        vm.memberships = []; //reset memberships before loading anew
        Collection.getMemberships()
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.memberships = data.memberships;
                vm.utils.loadingFinished(focusToCollectionElement);
                vm.getUser(); //display admin features if an admin
            }, function (resp) {
                vm.utils.showError(resp);
            });
    }

    function getUser() {
        User.getUser()
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.user = data.user;
                if (vm.user.admin == 'true') {
                    vm.admin = true;
                    //set LTI height after new panels and such have been added
                    vm.utils.setLtiHeight();
                }
            }, function (resp) {
                vm.utils.showError(resp);
            });
    }

    function isSubstringNotFound(string1, string2) {
        if (string1.toLowerCase().indexOf(string2.toLowerCase()) === -1) {
            return true;
        }

        return false;
    }

    function onCollectionAdded($event) {
        var membership = $event.membership,
            focusElement = '#collection-header-' + membership.collection.id;

        vm.memberships.push(membership);
        //if an admin, include in the list of all collections in the system
        if (vm.adminCollectionData.collections) {
            vm.adminCollectionData.collections.push(membership);
        }

        vm.utils.loadingFinished();
        vm.utils.focusToElement(focusElement); //focus for screenreaders
    }

    function togglePublicCollectionVisibility() {
        vm.publicCollectionsVisible = !vm.publicCollectionsVisible;
        vm.utils.setLtiHeight();
    }
}