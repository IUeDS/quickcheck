app.component('qcErrorMessage', {
    controller: ErrorController,
    controllerAs: 'vm',
    bindings: {
        'utils': '<qcUtils'
    },
    template: '<div class="row">' +
                    '<div class="col-xs-12">' +
                            '<div class="alert alert-danger error-message" role="alert" tabindex="-1" ng-cloak>' +
                                '<p class="lead">Error</p>' +
                                '<p ng-repeat="errorReason in vm.utils.errorList" ng-bind-html="errorReason"></p>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
});

function ErrorController() {
    //nothing needed for now, but setting up to use controllerAs syntax for consistency
}