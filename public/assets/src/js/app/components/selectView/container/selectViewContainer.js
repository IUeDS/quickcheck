app.component('qcSelectView', {
    controller: SelectViewController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('selectViewContainerTemplate.html');
    }]
});

SelectViewController.$inject = ['Collection', 'User', 'Utilities', '$sce'];

function SelectViewController(Collection, User, Utilities, $sce) {
    var vm = this;

    //variables
    vm.user = {};
    vm.admin = false;
    vm.memberships = [];
    vm.assessments = [];
    //there isn't an angular-friendly way to grab server-side embedded values in html, unfortunately...
    vm.redirectUrl = $('#redirect-url').val();
    vm.launchUrlStem = $('#launch-url-stem').val();
    vm.search = {};
    vm.search.searchText = '';
    vm.search.searchActivated = false;
    vm.search.searchResults = [];
    vm.utils = new Utilities();
    vm.adminCollectionData = {
        'viewAll': false,
        'collections': []
    };

    //functions
    vm.$onInit = $onInit;
    vm.clearSearch = clearSearch;
    vm.createContentItemJson = createContentItemJson;
    vm.getAssessments = getAssessments;
    vm.getMemberships = getMemberships;
    vm.getUser = getUser;
    vm.search = search;
    vm.updateSearch = updateSearch;

    function $onInit() {
        vm.getMemberships();
        //use $sce so angular knows form action is secure
        vm.redirectUrl = $sce.trustAsResourceUrl(vm.redirectUrl);
    }

    function clearSearch() {
        vm.search.searchText = '';
        vm.updateSearch();
    }

    function createContentItemJson(assessment) {
        var contentItemJson = {
            '@context': 'http://purl.imsglobal.org/ctx/lti/v1/ContentItem',
            '@graph': [
                {
                    '@type': 'LtiLinkItem',
                    '@id': vm.launchUrlStem + assessment.id,
                    'url': vm.launchUrlStem + assessment.id,
                    'title': assessment.name,
                    'text': 'Quick Check',
                    'mediaType': 'application/vnd.ims.lti.v1.ltilink',
                    'placementAdvice': {
                        'presentationDocumentTarget': 'frame'
                    }
                }
            ]
        };

        return JSON.stringify(contentItemJson);
    }

    //grab the assessments out of the collections/assessment groups to make search easier
    //differentiate between personal memberships vs. all collections for admins
    function getAssessments() {
        var collections,
            assessments = [];
        if (vm.adminCollectionData.viewAll) {
            collections = vm.adminCollectionData.collections;
        }
        else {
            collections = vm.memberships.map(function(membership) {
                return membership.collection;
            });
        }
        collections.forEach(function(collection) {
            collection.assessment_groups.forEach(function(assessmentGroup) {
                assessmentGroup.assessments.forEach(function(assessment) {
                    assessments.push(assessment);
                });
            });
        });

        return assessments;
    }

    function getMemberships() {
        vm.utils.loadingStarted();
        Collection.getMembershipsWithAssessments()
              .then(function (resp) {
                  var data = vm.utils.getResponseData(resp);
                  vm.memberships = data.memberships;
                  vm.utils.loadingFinished();
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
                  }
              }, function (resp) {
                  vm.utils.showError(resp);
              });
    }

    function search() {
        var assessments = vm.getAssessments();
        vm.search.searchResults = [];
        assessments.forEach(function(assessment) {
            if (assessment.name.toLowerCase().indexOf(vm.search.searchText) !== -1) {
                vm.search.searchResults.push(assessment);
            }
        });
    }

    function updateSearch() {
        if (vm.search.searchText === '') {
            vm.search.searchActivated = false;
            vm.search.searchResults = [];
        }
        else {
            vm.search.searchText = vm.search.searchText.toLowerCase();
            vm.search();
            vm.search.searchActivated = true;
        }
    }
}