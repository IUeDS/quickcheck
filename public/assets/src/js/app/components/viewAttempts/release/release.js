app.component('qcRelease', {
    controller: ReleaseController,
    controllerAs: 'vm',
    bindings: {
        assessmentId: '=qcAssessmentId',
        release: '=qcExistingRelease',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('releaseTemplate.html');
    }]
});

ReleaseController.$inject = ['Manage', '$timeout'];

function ReleaseController(Manage, $timeout) {
    var vm = this;

    vm.error = false;
    vm.success = false;

    vm.createRelease = createRelease;
    vm.rollbackRelease = rollbackRelease;
    vm.toggleTooltip = toggleTooltip;

    function createRelease() {
        var releaseData = { 'assessmentId': vm.assessmentId, 'ltiContextId': vm.utils.contextId };
        Manage.createRelease(releaseData)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.release = data.release;
                vm.error = false; //reset this if it was set previously
                vm.success = 'Release successful';
                vm.toggleTooltip(); //toggle the tooltip on the updated release button
            }, function(resp) {
                vm.error = vm.utils.getError(resp);
                vm.success = false; //reset if necessary
            });
    }

    function rollbackRelease() {
        Manage.rollbackRelease(vm.release.id)
            .then(function(resp) {
                vm.release = false; //remove the existing release
                vm.success = 'Release successfully rolled back';
                vm.error = false; //reset this if it was set previously
                vm.toggleTooltip(); //toggle the tooltip on the updated release button
            }, function(resp) {
                vm.error = vm.utils.getError(resp);
                vm.success = false; //reset if necessary
            });
    }

    function toggleTooltip() {
        $timeout(function() {
            $('[data-toggle="tooltip"]').tooltip();
        }, 0, false);
    }
}