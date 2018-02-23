var SubsetPanelComponent = function(browserRef, subsetElement) {
    var component = this;
    component.browser = browserRef;
    //default to first subset; can be set manually as well
    if (subsetElement) {
        component.subset = subsetElement;
    }
    else {
        component.subset = component.browser.element.all(by.repeater('assessmentGroup in vm.assessmentGroups')).first();
    }

    //elements
    component.addQcBtn = component.subset.element(by.partialButtonText('Add new quick check to subset'));
    component.deleteSubsetBtn = component.subset.element(by.css('.qc-subset-delete-btn'));
    component.editSubsetBtn = component.subset.element(by.css('.qc-subset-edit-btn'));
    component.editSubsetInput = component.subset.element(by.css('input'));
    component.header = component.subset.element(by.css('.qc-assessment-group-title'));
    component.name = component.subset.element(by.css('h3'));
    component.newQcInput = component.subset.element(by.css('input'));
    component.quickChecks = component.subset.all(by.repeater('assessment in vm.assessmentGroup.assessments'));
    component.saveQcBtn = component.subset.element(by.partialButtonText('Save'));
    component.subsetInstructions = component.subset.element(by.tagName('p'));

    //selectors (for sub-components)
    component.copyQcBtn = '.qc-quiz-copy-btn';
    component.copyQcEditBtn = '.qc-quiz-copy-edit-btn';
    component.copyQcName = '.qc-copy-quiz-name';
    component.copyQcPanel = '.qc-quiz-copy-panel';
    component.copyQcSetSelect = '.qc-copy-quiz-collection';
    component.copyQcSubmitBtn = '.qc-copy-quiz-submit';
    component.copyQcSubsetSelect = '.qc-copy-quiz-assessment-group';
    component.deleteQcBtn = '.qc-quiz-delete-btn';
    component.editQcBtn = '.qc-quiz-edit-btn';
    component.previewQcBtn = '.qc-quiz-preview-btn';

    //functions
    component.addQuickCheck = addQuickCheck;
    component.addAndSaveQuickCheck = addAndSaveQuickCheck;
    component.areSubsetInstructionsVisible = areSubsetInstructionsVisible;
    component.copyQuickCheck = copyQuickCheck;
    component.deleteQuickCheck = deleteQuickCheck;
    component.deleteSubset = deleteSubset;
    component.editQuickCheck = editQuickCheck;
    component.editSubset = editSubset;
    component.getAddQcBtn = getAddQcBtn;
    component.getCopyEditBtn = getCopyEditBtn;
    component.getCopyPanel = getCopyPanel;
    component.getCopyQuickCheckName = getCopyQuickCheckName;
    component.getCopySelectSetDropdownOptions = getCopySelectSetDropdownOptions;
    component.getCopySelectSetDropdownValue = getCopySelectSetDropdownValue;
    component.getCopySelectSubsetDropdownOptions = getCopySelectSubsetDropdownOptions;
    component.getCopySelectSubsetDropdownValue = getCopySelectSubsetDropdownValue;
    component.getDeleteQcBtn = getDeleteQcBtn;
    component.getDeleteSubsetBtn = getDeleteSubsetBtn;
    component.getEditSubsetBtn = getEditSubsetBtn
    component.getEditSubsetInput = getEditSubsetInput;
    component.getName = getName;
    component.getNewQcInput = getNewQcInput;
    component.getQuickChecks = getQuickChecks;
    component.previewQuickCheck = previewQuickCheck;
    component.saveQuickCheck = saveQuickCheck;
    component.setSubset = setSubset;
    component.submitCopy = submitCopy;
    component.submitEditedSubset = submitEditedSubset;
    component.toggleAccordion = toggleAccordion;

    function addQuickCheck() {
        component.addQcBtn.click();
    }

    function addAndSaveQuickCheck(quickcheckName) {
        component.addQcBtn.click();
        component.getNewQcInput().sendKeys(quickcheckName);
        component.saveQuickCheck();
    }

    function areSubsetInstructionsVisible() {
        return component.subsetInstructions.isDisplayed();
    }

    function copyQuickCheck(quickcheck) {
        quickcheck.element(by.css(component.copyQcBtn)).click();
    }

    function deleteQuickCheck(quickCheck) {
        quickCheck.element(by.css(component.deleteQcBtn)).click();
    }

    function deleteSubset() {
        component.deleteSubsetBtn.click();
    }

    function editQuickCheck(quickCheck) {
        quickCheck.element(by.css(component.editQcBtn)).click();
        component.browser.sleep(1000);
    }

    function editSubset() {
        component.editSubsetBtn.click();
    }

    function getAddQcBtn() {
        return component.addQcBtn;
    }

    function getCopyEditBtn(quickcheck) {
        return quickcheck.element(by.css(component.copyQcEditBtn));
    }

    function getCopyPanel(quickcheck) {
        return quickcheck.element(by.css(component.copyQcPanel));
    }

    function getCopyQuickCheckName(quickcheck) {
        return quickcheck.element(by.css(component.copyQcName)).getAttribute('value');
    }

    function getCopySelectSetDropdownOptions(quickcheck) {
        return quickcheck.element(by.css(component.copyQcSetSelect)).all(by.css('option'));
    }

    function getCopySelectSetDropdownValue(quickcheck) {
        return quickcheck.element(by.css(component.copyQcSetSelect)).element(by.css('option:checked')).getText();
    }

    function getCopySelectSubsetDropdownOptions(quickcheck) {
        return quickcheck.element(by.css(component.copyQcSubsetSelect)).all(by.css('option'));
    }

    function getCopySelectSubsetDropdownValue(quickcheck) {
        return quickcheck.element(by.css(component.copyQcSubsetSelect)).element(by.css('option:checked')).getText();
    }

    function getDeleteQcBtn(quickcheck) {
        return quickcheck.element(by.css(component.deleteQcBtn));
    }

    function getDeleteSubsetBtn() {
        return component.deleteSubsetBtn;
    }

    function getEditSubsetBtn() {
        return component.editSubsetBtn;
    }

    function getEditSubsetInput() {
        return component.editSubsetInput;
    }

    function getName() {
        return component.name.getText();
    }

    function getNewQcInput() {
        return component.newQcInput;
    }

    function getQuickChecks() {
        return component.quickChecks;
    }

    function previewQuickCheck(quickCheck) {
        quickCheck.element(by.css(component.previewQcBtn)).click();
    }

    function saveQuickCheck() {
        component.saveQcBtn.click();
    }

    function setSubset(subset) {
        component.subset = subset;
    }

    function submitCopy(quickcheck) {
        quickcheck.element(by.css(component.copyQcSubmitBtn)).click();
    }

    function submitEditedSubset(name) {
        var input = this.getEditSubsetInput();
        input.sendKeys(name);
        var enter = browser.actions().sendKeys(protractor.Key.ENTER);
        enter.perform();
    }

    function toggleAccordion() {
        //subset.element(by.css(page.subsetHeader)).click();
        component.header.click();
        component.browser.sleep(1000); //wait for animation to finish
    }
}

module.exports = SubsetPanelComponent;