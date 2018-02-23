app.component('qcErrorModal', {
    controller: ErrorModalController,
    controllerAs: 'vm',
    bindings: {
        errorMessage: '<qcErrorMessage'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('errorModalTemplate.html');
    }]
});

function ErrorModalController() {
    var vm = this;

    vm.$onInit = $onInit;

    function $onInit() {
        $('#qc-assessment-error-modal').modal({backdrop: 'static', keyboard: false});
    }
}