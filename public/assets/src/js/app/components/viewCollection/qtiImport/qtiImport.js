app.component('qcQtiImport', {
    controller: QtiImportController,
    controllerAs: 'vm',
    bindings: {
        assessmentGroups: '<qcAssessmentGroups',
        isImportingQti: '=qcIsImportingQti'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('qtiImportTemplate.html');
    }]
});

QtiImportController.$inject = ['HttpService', 'Utilities', 'Upload', 'Collection'];

function QtiImportController (HttpService, Utilities, Upload, Collection) {
    var vm = this;

    //variables
    vm.assessment_group_id = null;
    vm.criticalNotices = null;
    vm.done = false;
    vm.error = false;
    vm.notices = null;
    vm.quizzes = null;
    vm.uploading = false;
    vm.utils = null;
    vm.zipFile = null;

    //functions
    vm.$onInit = $onInit;
    vm.cancelQtiImport = cancelQtiImport;
    vm.importQti = importQti;
    vm.resetQtiImport = resetQtiImport;
    vm.saveImportQuizzes = saveImportQuizzes;
    vm.uploadFile = uploadFile;

    function $onInit() {
        vm.utils = new Utilities();
        vm.utils.setLtiHeight();
        $('[data-toggle="popover"]').popover(); //init Bootstrap popovers
    }

    function cancelQtiImport() {
        vm.isImportingQti = false;
        vm.utils.setLtiHeight();
    }

    function importQti() {
        if (vm.zipFile) {
            vm.uploadFile(vm.zipFile);
        }
    }

    function resetQtiImport() {
        vm.assessment_group_id = null;
        vm.criticalNotices = null;
        vm.done = false;
        vm.error = false;
        vm.notices = null;
        vm.quizzes = null;
        vm.uploading = false;
        vm.zipFile = null;
        vm.utils.setLtiHeight();
    }

    function saveImportQuizzes() {
        vm.uploading = true;
        vm.done = false;
        Collection.createImportedQuizzes({ 'quizzes': vm.quizzes })
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.quizzes = data.quizzes;
                vm.uploading = false;
                vm.done = true;
                vm.notices = false;
                vm.criticalNotices = false;
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function uploadFile(file) {
        vm.uploading = true;
        Upload.upload({
            url: HttpService.getApiRoot() + 'importQTI',
            data: { 'importFile': file, 'assessment_group_id': vm.assessment_group_id }
        }).then(function(resp) {
            vm.uploading = false;
            vm.done = true;
            var data;
            if (!vm.utils.isSuccessResponse(resp)) {
                vm.error = vm.utils.getError(resp);
            }
            else {
                data = vm.utils.getResponseData(resp);
                var warnings = data.warnings;
                if (warnings.critical.length) {
                    vm.criticalNotices = warnings.critical;
                }
                vm.notices = warnings.notices;
                vm.quizzes = data.quizzes;
            }
        }, function(resp) {
            vm.uploading = false;
            vm.done = true;
            vm.error = vm.utils.getError(resp);
        });
    }
}