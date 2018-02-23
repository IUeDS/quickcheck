app.component('qcViewCollection', {
    controller: ViewCollectionController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('viewCollectionContainerTemplate.html');
    }]
});

ViewCollectionController.$inject = ['$location', '$sce', 'Collection', 'User', 'Utilities'];

function ViewCollectionController ($location, $sce, Collection, User, Utilities) {
    var vm = this;

    vm.collectionId = false;
    vm.collection = null;
    vm.currentPage = 'sets';
    vm.readOnly = false; //if user has read-only permissions, they can't see certain options
    vm.assessmentGroups = [];
    vm.isImportingQti = false;
    vm.isExportingQti = false;
    vm.currentUser = {};
    vm.admin = false;
    vm.searchResults = null;
    vm.searchTerm = '';
    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.getCollection = getCollection;
    vm.getCollectionIdFromUrl =getCollectionIdFromUrl;
    vm.getUser = getUser;
    vm.onAssessmentCopy = onAssessmentCopy;
    vm.onAssessmentGroupDeleted = onAssessmentGroupDeleted;
    vm.onAssessmentGroupSaved = onAssessmentGroupSaved;
    vm.search = search;

    function $onInit() {
        vm.collectionId = vm.getCollectionIdFromUrl();
        vm.getCollection();
        vm.getUser();
    }

    //get the collection and all assessmentgroups/assessments from the DB
    function getCollection() {
        vm.utils.loadingStarted();
        Collection.getCollection(vm.collectionId)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.collection = data.collection;
                vm.assessmentGroups = data.assessmentGroups;
                vm.readOnly = data.readOnly;
                vm.utils.loadingFinished();
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function getCollectionIdFromUrl() {
        //get the collection id from the Laravel url, /collection/{id}
        var splitUrl = $location.path().split('/'),
            lastParam = splitUrl[splitUrl.length - 1],
            splitQuery = lastParam.split('?'), //even if no query string, returns single string in array to grab
            collectionId = splitQuery[0];

        return collectionId;
    }

    function getUser() {
        User.getUser()
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.currentUser = data.user;
                if (vm.currentUser.admin == 'true') {
                    vm.admin = true;
                }
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function onAssessmentCopy($event) {
        var assessment = $event.assessment;

        vm.assessmentGroups.forEach(function(assessmentGroup) {
            if (assessmentGroup.id == assessment.assessment_group_id) {
                assessmentGroup.assessments.push(assessment);
            }
        });
    }

    function onAssessmentGroupDeleted($event) {
        var assessmentGroupIndex = $event.assessmentGroupIndex;
        vm.assessmentGroups.splice(assessmentGroupIndex, 1);
    }

    function onAssessmentGroupSaved($event) {
        var newAssessmentGroup = $event.newAssessmentGroup;
        vm.assessmentGroups.push(newAssessmentGroup);
        //focus to newly created assessment group to orient screenreader users
        vm.utils.focusToElement('#heading-group-' + newAssessmentGroup.id);
    }

    function search() {
        if (!vm.searchTerm) {
            return;
        }

        vm.utils.loadingStarted();
        Collection.search(vm.collectionId, vm.searchTerm).then(function(resp) {
            var data = vm.utils.getResponseData(resp);
            vm.searchResults = data.searchResults;
            vm.utils.loadingFinished();
        }, function(resp) {
            vm.utils.showError(resp);
        });
    }
}