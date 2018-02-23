app.component('qcQtiExport', {
    controller: QtiExportController,
    controllerAs: 'vm',
    bindings: {
        assessmentGroups: '<qcAssessmentGroups',
        isExportingQti: '=qcIsExportingQti'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('qtiExportTemplate.html');
    }]
});

function QtiExportController() {
    var vm = this;

    vm.assessmentList = null;
    vm.assessments = null;
    vm.checkAll = false;

    vm.$onInit = $onInit;
    vm.$onChanges = $onChanges;
    vm.cancelQtiExport = cancelQtiExport;
    vm.formatQtiExportData = formatQtiExportData;
    vm.toggleQtiExportCheckAll = toggleQtiExportCheckAll;
    vm.toggleAssessmentExport = toggleAssessmentExport;

    function $onInit() {
        vm.toggleQtiExportCheckAll();
    }

    function $onChanges(changes) {
        //since assessment groups are fetched asynchronously in parent, the check
        //all functionality does not work right off the bat, requires updating
        //the bindings after the async call returns in parent
        if (changes.assessmentGroups) {
            vm.toggleQtiExportCheckAll();
        }
    }

    function cancelQtiExport() {
        vm.isExportingQti = false;
    }

    function formatQtiExportData() {
        //convert from object into array
        var assessmentIds = Object.keys(vm.assessmentList);
        vm.assessments = [];
        assessmentIds.forEach(function(assessmentId) {
            if (vm.assessmentList[assessmentId]) {
                vm.assessments.push(assessmentId);
            }
        });
    }

    function toggleAssessmentExport(assessmentId) {
        if (vm.assessmentList[assessmentId]) {
            vm.assessmentList[assessmentId] = false;
            //unset the check all box if one of these has been unchecked
            vm.checkAll = false;
        } else {
            vm.assessmentList[assessmentId] = true;
        }
        vm.formatQtiExportData();
    }

    function toggleQtiExportCheckAll() {
        //reset the list
        vm.assessments = []; //list of IDs that will be POSTed to endpoint
        vm.assessmentList = {}; //object that determines which ones are selected

        if (vm.checkAll) {
            vm.checkAll = false;
        }
        else {
            vm.checkAll = true;
            //add assessments back in
            vm.assessmentGroups.forEach(function(assessmentGroup) {
                assessmentGroup.assessments.forEach(function(assessment) {
                    //create an object with each of the assessment IDs as keys, so it's
                    //faster to check on the page which ones have been selected or not
                    var id = assessment.id.toString();
                    if (!assessment.custom_activity_id) { //cannot convert custom activities into QTI
                        vm.assessmentList[id] = true;
                    }
                });
            });
        }

        vm.formatQtiExportData();
    }
}