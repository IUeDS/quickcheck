var includes = require('../common/includes.js'),
    data = includes.data,
    setPage = new includes.SetPage(browser);

describe('Exporting a QTI package', function() {
    it('should show the export panel when the button is clicked', async function() {
        await setPage.clickExportQtiBtn();
        expect(await setPage.qtiExport.getCheckboxes().get(0).isDisplayed()).toBe(true);
    });

    it('should automatically have all assessments checked and list all assessments', async function() {
        var names = data.sets.featuresAllOn.quickchecks,
            labels = ['All quick checks in this set', names.featuresAllOn, names.qtiImportGraded, names.qtiImportUngraded];

        await setPage.qtiExport.getCheckboxes().each(async function(checkbox, index) {
            expect(await setPage.qtiExport.isQcSelected(checkbox)).toBeTruthy();
            expect(await checkbox.getText()).toContain(labels[index]);
        });
    });

    it('should uncheck all assessments when the select all checkbox is clicked', async function() {
        await setPage.qtiExport.toggleAllSelected();
        await setPage.qtiExport.getCheckboxes().each(async function(checkbox, index) {
            expect(await setPage.qtiExport.isQcSelected(checkbox)).toBeFalsy();
        });
    });
});