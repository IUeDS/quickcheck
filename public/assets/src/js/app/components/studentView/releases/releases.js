app.component('qcReleases', {
    controller: ReleasesController,
    controllerAs: 'vm',
    bindings: {
        onViewAttempts: '&qcOnViewAttempts',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('releasesTemplate.html');
    }]
});

ReleasesController.$inject = ['Manage'];

function ReleasesController(Manage) {
    var vm = this;

    vm.releases = [];
    vm.search = {'assessmentName': ''}; //for searching through attempts

    vm.$onInit = $onInit;
    vm.isSubstringNotFound = isSubstringNotFound;
    vm.viewAttempts = viewAttempts;

    function $onInit() {
        vm.utils.loadingStarted();
        Manage.getReleases(vm.utils.contextId)
            .then(function (resp) {
                var data = vm.utils.getResponseData(resp);
                vm.releases = data.releases;
                vm.utils.loadingFinished();
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function isSubstringNotFound(string1, string2) {
        if (string1.toLowerCase().indexOf(string2.toLowerCase()) === -1) {
            return true;
        }
        else {
            return false;
        }
    }

    function viewAttempts(assessment) {
        vm.onViewAttempts({
            $event: {
                assessment: assessment
            }
        });
    }
}