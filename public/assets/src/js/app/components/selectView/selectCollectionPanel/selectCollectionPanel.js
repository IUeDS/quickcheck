app.component('qcCollectionSelectPanel', {
    controller: SelectCollectionPanelController,
    controllerAs: 'vm',
    bindings: {
        collection: '=qcCollection',
        membership: '=?qcMembership',
        redirectUrl: '=qcRedirectUrl',
        launchUrlStem: '<qcLaunchUrlStem'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('selectCollectionPanelTemplate.html');
    }]
});

SelectCollectionPanelController.$inject = ['$sce'];

function SelectCollectionPanelController($sce) {
    var vm = this;

    vm.createContentItemJson = createContentItemJson;
    vm.$onInit = $onInit;

    function $onInit() {
        //use $sce so angular knows form action is secure
        vm.redirectUrl = $sce.trustAsResourceUrl(vm.redirectUrl);
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
}