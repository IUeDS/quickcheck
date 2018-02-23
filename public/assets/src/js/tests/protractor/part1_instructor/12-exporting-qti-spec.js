var includes = require('../common/includes.js'),
    data = includes.data,
    setPage = new includes.SetPage(browser);

describe('Exporting a QTI package', function() {
    it('should show the export panel when the button is clicked', function() {
        setPage.clickExportQtiBtn();
        expect(setPage.qtiExport.getCheckboxes().get(0).isDisplayed()).toBe(true);
    });

    it('should automatically have all assessments checked and list all assessments', function() {
        var names = data.sets.featuresAllOn.quickchecks,
            labels = ['All quick checks in this set', names.featuresAllOn, names.qtiImportGraded, names.qtiImportUngraded];

        setPage.qtiExport.getCheckboxes().each(function(checkbox, index) {
            expect(setPage.qtiExport.isQcSelected(checkbox)).toBeTruthy();
            expect(checkbox.getText()).toContain(labels[index]);
        });
    });

    it('should uncheck all assessments when the select all checkbox is clicked', function() {
        setPage.qtiExport.toggleAllSelected();
        setPage.qtiExport.getCheckboxes().each(function(checkbox, index) {
            expect(setPage.qtiExport.isQcSelected(checkbox)).toBeFalsy();
        });
    });
});