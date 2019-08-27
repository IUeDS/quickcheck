var QtiExportComponent = function(browserRef) {
    var component = this;
    component.browser = browserRef;

    //elements
    component.checkboxes = component.browser.element.all(by.css('.qc-qti-export-list .checkbox'));

    //sub-string selectors
    component.selectQcInput = 'input[type="checkbox"]';

    //functions
    component.getCheckboxes = getCheckboxes;
    component.isQcSelected = isQcSelected;
    component.toggleAllSelected = toggleAllSelected;

    function getCheckboxes() {
        return component.checkboxes;
    }

    async function isQcSelected(item) {
        return await item.element(by.css(component.selectQcInput)).getAttribute('checked');
    }

    async function toggleAllSelected() {
        await component.checkboxes.get(0).element(by.css(component.selectQcInput)).click();
    }
}

module.exports = QtiExportComponent;