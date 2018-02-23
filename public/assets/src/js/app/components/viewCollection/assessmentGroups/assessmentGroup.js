app.component('qcAssessmentGroup', {
    controller: AssessmentGroupController,
    controllerAs: 'vm',
    bindings: {
        assessmentGroup: '<qcAssessmentGroupData',
        assessmentGroupIndex: '<qcAssessmentGroupIndex',
        onAssessmentCopy: '&qcOnAssessmentCopy',
        onDelete: '&qcOnDelete',
        readOnly: '<qcReadOnly',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('assessmentGroupTemplate.html');
    }]
});

AssessmentGroupController.$inject = ['AssessmentEdit', 'Collection', 'HttpService'];

function AssessmentGroupController(AssessmentEdit, Collection, HttpService) {
    var vm = this;

    vm.editingData = {};
    vm.isAddingAssessment = null;
    vm.isEditing = false;
    vm.memberships = null;
    vm.newAssessment = null;

    vm.$onInit = $onInit;

    vm.copyAssessment = copyAssessment;
    vm.copyAssessmentCancel = copyAssessmentCancel;
    vm.deleteAssessment = deleteAssessment;
    vm.deleteAssessmentGroup = deleteAssessmentGroup;
    vm.editAssessmentGroup = editAssessmentGroup;
    vm.editAssessmentGroupCancel = editAssessmentGroupCancel;
    vm.getMemberships = getMemberships;
    vm.initCopyAssessment = initCopyAssessment;
    vm.initNewAssessment = initNewAssessment;
    vm.newAssessmentCancel = newAssessmentCancel;
    vm.onCopyAssessmentCollectionSelected = onCopyAssessmentCollectionSelected;
    vm.saveNewAssessment = saveNewAssessment;
    vm.setCopyAssessmentDefault = setCopyAssessmentDefault;
    vm.stopAccordion = stopAccordion;
    vm.toggleAccordion = toggleAccordion;
    vm.updateAssessmentGroup = updateAssessmentGroup;

    function $onInit() {
        //initialize element selectors that can be focused to for accessibility
        vm.focusEditAssessmentGroup = '#assessment-group-name-' + vm.assessmentGroup.id;
        vm.focusNewAssessment = '#create-assessment-header-' + vm.assessmentGroup.id;
        vm.focusSaveAssessment = '#assessment-edit-'; //assessment ID filled in as needed
        vm.focusUpdateAssessmentGroup = '#heading-group-' + vm.assessmentGroup.id;

        //if a newly created assessment group, initialize empty array of assessments
        if (!vm.assessmentGroup.assessments) {
            vm.assessmentGroup.assessments = [];
        }

        vm.utils.setLtiHeight();
    }

    function copyAssessment(assessment) {
        vm.utils.loadingStarted();
        var data = {
            'assessment_group_id': assessment.copyData.assessment_group_id,
            'assessment_name': assessment.copyData.assessment_name
        };

        Collection.copyAssessment(assessment.id, data).then(function(resp) {
            //get edit url
            var data = vm.utils.getResponseData(resp),
                assessmentId = data.assessment.id,
                assessmentEditUrl = HttpService.getPageRoot() + '/assessment/' + assessmentId + '/edit';
            if (vm.utils.isLti) {
                assessmentEditUrl = vm.utils.setContextLink(assessmentEditUrl);
            }
            assessment.copyData.editUrl = assessmentEditUrl;
            assessment.copyData.copied = true;

            //if within the same subset, add to this component
            if (assessment.copyData.assessment_group_id == vm.assessmentGroup.id) {
                vm.assessmentGroup.assessments.push(data.assessment);
            }
            //if within the same set, fire even to parent to add to the page
            else if (assessment.copyData.collection_id == vm.assessmentGroup.collection_id) {
                vm.onAssessmentCopy({
                    $event: {
                        assessment: data.assessment
                    }
                });
            }
            vm.utils.loadingFinished();
        }, function(resp) {
            vm.utils.showError(resp);
        });

        vm.utils.setLtiHeight();
    }

    function copyAssessmentCancel(assessment) {
        assessment.isCopying = false;
        assessment.copyData = {};
        vm.utils.setLtiHeight();
    }

    function deleteAssessment(id, index) {
        if (!window.confirm('Are you sure you want to delete this quick check?')) {
            return;
        }

        AssessmentEdit.deleteAssessment(id)
            .then(function(resp) {
                vm.assessmentGroup.assessments.splice(index, 1);
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function deleteAssessmentGroup($event) {
        vm.stopAccordion($event); //prevent accordion from getting toggled by button click

        if (!window.confirm('Are you sure you want to delete this subset?')) {
            return;
        }

        vm.utils.loadingStarted();
        Collection.deleteAssessmentGroup(vm.assessmentGroup.id)
            .then(function(resp) {
                vm.utils.loadingFinished();
                //pass event up to parent, so that this assessment group can be removed from the
                //array, which this component does not and should not have access to
                vm.onDelete({
                    $event: {
                        assessmentGroupIndex: vm.assessmentGroupIndex
                    }
                });
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    function editAssessmentGroup($event) {
        vm.stopAccordion($event);
        //copy model, in case user makes updates and then cancels, so that existing model doesn't change on the page
        angular.copy(vm.assessmentGroup, vm.editingData);
        vm.isEditing = true;

        //move focus to appropriate header to orient screenreader users
        vm.utils.focusToElement(vm.focusEditAssessmentGroup);
    }

    function editAssessmentGroupCancel() {
        vm.isEditing = false;
    }

    function getMemberships() {
        vm.utils.loadingStarted();
        return Collection.getMembershipsWithAssessments().then(function(resp) {
            var data = vm.utils.getResponseData(resp);
            vm.memberships = data.memberships;
            vm.utils.loadingFinished();
        }, function(resp) {
            vm.utils.showError(resp);
        });
    }

    function initCopyAssessment(assessment) {
        //load once from back-end and then cache
        if (!vm.memberships) {
            vm.getMemberships().then(function() {
                vm.setCopyAssessmentDefault(assessment);
            });
        }
        else {
            vm.setCopyAssessmentDefault(assessment);
        }

        assessment.isCopying = true;
        vm.utils.setLtiHeight();
    }

    function initNewAssessment() {
        vm.isAddingAssessment = true;
        vm.newAssessment = {};

        //move focus to appropriate header to orient screenreader users
        vm.utils.focusToElement(vm.focusNewAssessment);
        vm.utils.setLtiHeight();
    }

    function newAssessmentCancel() {
        vm.isAddingAssessment = false;
    }

    function onCopyAssessmentCollectionSelected(assessment) {
        var collectionId = assessment.copyData.collection_id;
        vm.memberships.forEach(function(membership) {
            if (membership.collection.id == collectionId) {
                var assessmentGroups = membership.collection.assessment_groups;
                assessment.copyData.assessmentGroups = assessmentGroups;
            }
        });
    }

    function saveNewAssessment() {
        //tried to set this as hidden input and bind to newAssessment model, but since newAssessment is blank, it overrode the value
        vm.newAssessment.assessment_group_id = vm.assessmentGroup.id;
        vm.utils.loadingStarted();
        AssessmentEdit.saveAssessment(vm.newAssessment)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                vm.newAssessment = {};
                vm.isAddingAssessment = false;
                vm.assessmentGroup.assessments.push(data.assessment);
                vm.utils.focusToElement(vm.focusSaveAssessment + data.assessment.id);
                vm.utils.loadingFinished();
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }

    //default to the current set/subset, with "copy" appended to name
    function setCopyAssessmentDefault(assessment) {
        assessment.copyData = {};
        assessment.copyData.collection_id = +(vm.assessmentGroup.collection_id);
        vm.onCopyAssessmentCollectionSelected(assessment); //set possible assessment group options
        assessment.copyData.assessment_group_id = +(vm.assessmentGroup.id);
        assessment.copyData.assessment_name = assessment.name + ' copy';
    }

    //when editing a subset, if a user clicks on the input or cancel buttons, stop accordion from opening/closing
    function stopAccordion($event) {
        $event.stopPropagation();
    }

    function toggleAccordion() {
        vm.assessmentGroup.closed = !vm.assessmentGroup.closed;
    }

    function updateAssessmentGroup() {
        vm.isEditing = false;
        vm.utils.loadingStarted();

        Collection.updateAssessmentGroup(vm.assessmentGroup.id, vm.editingData)
            .then(function(resp) {
                var data = vm.utils.getResponseData(resp);
                //really the only attribute that the user can change
                vm.assessmentGroup.name = data.assessmentGroup.name;
                vm.utils.focusToElement(vm.focusUpdateAssessmentGroup);
            }, function(resp) {
                vm.utils.showError(resp);
            });
    }
}