app.component('qcQuickAdd', {
    controller: QuickAddController,
    controllerAs: 'vm',
    bindings: {
        onCancel: '&qcOnCancel',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('quickAddTemplate.html');
    }]
});

QuickAddController.$inject = ['Collection', 'HttpService', '$window'];

function QuickAddController(Collection, HttpService, $window) {
    var vm = this;

    vm.assessment = {}; //data to be passed back if adding a new quick check
    vm.memberships = []; //if adding, possible collections/assessment groups new assessment can belong to
    vm.newCollectionAdded = false; //if adding a new collection on the fly
    vm.newAssessmentGroupAdded = false; //if adding a new assessment group on the fly
    vm.selectedCollection = {}; //if adding, collection selected, from which we can draw assessment groups to select

    vm.$onInit = $onInit;
    vm.cancelAdd = cancelAdd;
    vm.collectionSelected = collectionSelected;
    vm.getCollections = getCollections;
    vm.groupSelected = groupSelected;
    vm.saveAssessment = saveAssessment;

    function $onInit() {
        vm.getCollections();
    }

    function cancelAdd() {
        //don't really need to send any data up to the parent component,
        //but also don't want unexpected angular errors if $event missing
        vm.onCancel({
            $event: {
                cancel: true
            }
        });
    }

    function collectionSelected() {
        if (vm.assessment.collection.id === 'new') {
            vm.newCollectionAdded = true;
            //fun fact: ng-selected does not update the select element's ng-model, so I have to set it manually here.
            //(if creating a new set, then the user will always be creating a new subset, as the new set is empty)
            //wtf, angular?!
            vm.assessment.assessmentGroup = {'id' : 'new'};
        }
        //since we can't assign an entire collection object to the value in a select dropdown,
        //we have to assign ID value to select and search through our collections to find the one;
        //didn't use ng-options to select the model since we need to add the "new" option hard-coded
        else {
            vm.newCollectionAdded = false;
            vm.memberships.forEach(function(membership) {
                if (membership.collection.id == vm.assessment.collection.id) {
                    vm.selectedCollection = membership.collection;
                }
            });
        }
    }

    function getCollections () {
        Collection.getMembershipsWithAssessments().then(function(resp) {
            var data = vm.utils.getResponseData(resp);
            vm.memberships = data.memberships;
        }, function(resp) {
            vm.utils.showError(resp);
        });
    }

    function groupSelected() {
        if (vm.assessment.assessmentGroup.id === 'new') {
            vm.newAssessmentGroupAdded = true;
        }
        else {
            vm.newAssessmentGroupAdded = false;
        }
    }

    function saveAssessment() {
        Collection.quickAdd({'assessment': vm.assessment}).then(function(resp) {
            //if successful, redirect to the quiz editing page
            var data = vm.utils.getResponseData(resp),
                assessmentId = data.assessmentId,
                assessmentEditUrl = HttpService.getPageRoot() + '/assessment/' + assessmentId + '/edit';
            if (vm.utils.isLti) {
                assessmentEditUrl = vm.utils.setContextLink(assessmentEditUrl);
            }
            $window.location.assign(assessmentEditUrl);

        }, function(resp) {
            vm.utils.showError(resp);
        });
    }
}