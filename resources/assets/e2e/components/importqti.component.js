var QtiImportComponent = function(browserRef) {
    var component = this;
    component.browser = browserRef;

    //elements
    component.criticalError = component.browser.element(by.css('.qc-qti-import-critical'));
    component.dropdown = component.browser.element(by.model('vm.assessment_group_id'));
    component.error = component.browser.element(by.css('.qti-import-error'));
    component.finishedPanel = component.browser.element(by.css('.qc-qti-import-finished'));
    component.importLinks = component.browser.element.all(by.css('.qc-import-qti-link'));
    component.notices = component.browser.element.all(by.repeater('notice in vm.notices'));
    component.panel = component.browser.element(by.css('#qc-qti-import-panel'));
    component.submitBtn = component.browser.element(by.css('.qc-btn-qti-import-submit'));
    component.success = component.browser.element(by.css('.qc-qti-import-success'));

    //sub-strings
    component.fileUpload = 'input[type="file"]';

    //functions
    component.getCriticalError = getCriticalError;
    component.getDropdown = getDropdown;
    component.getDropdownOptions = getDropdownOptions;
    component.getError = getError;
    component.getFinishedPanel = getFinishedPanel;
    component.getImportLinks = getImportLinks;
    component.getNotices = getNotices;
    component.getSuccess = getSuccess;
    component.isImportFinished = isImportFinished;
    component.submit = submit;
    component.uploadFile = uploadFile;

    function getCriticalError() {
        return component.criticalError;
    }

    function getDropdown() {
        return component.dropdown;
    }

    function getDropdownOptions() {
        return component.dropdown.all(by.css('option'));
    }

    function getError() {
        return component.error;
    }

    function getFinishedPanel() {
        return component.finishedPanel;
    }

    function getImportLinks() {
        return component.importLinks;
    }

    function getNotices() {
        return component.notices;
    }

    function getSuccess() {
        return component.success;
    }

    async function isImportFinished() {
        return await component.finishedPanel.isPresent();
    }

    async function submit() {
        await component.submitBtn.click();
    }

    async function uploadFile(absolutePath) {
        await component.panel.element(by.css(component.fileUpload)).sendKeys(absolutePath);
    }
}

module.exports = QtiImportComponent;