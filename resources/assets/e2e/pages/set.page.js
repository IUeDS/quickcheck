var SetPage = function(browserRef) {
    var page = this,
        EC = protractor.ExpectedConditions;
    page.browser = browserRef;
    page.includes = require('../common/includes.js');
    page.common = new page.includes.Common(page.browser);

    //sub-components
    page.featurePanel = new page.includes.FeaturePanelComponent(page.browser);
    page.nav = new page.includes.NavComponent(page.browser);
    page.qtiExport = new page.includes.QtiExportComponent(page.browser);
    page.qtiImport = new page.includes.QtiImportComponent(page.browser);
    page.subsets = [];
    page.userPanel = new page.includes.UserPanelComponent(page.browser);

    //elements
    page.addSubsetBtn = page.browser.element(by.partialButtonText('Add new subset'));
    page.exportQtiBtn = page.browser.element(by.css('.qc-btn-qti-export'));
    page.featuresAccordion = page.browser.element(by.cssContainingText('.card-header', 'Show features in this set'));
    page.searchBox = page.browser.element(by.css('.qc-search-box'));
    page.importQtiBtn = page.browser.element(by.css('.qc-btn-qti-import'));
    page.initialInstructions = page.browser.element(by.css('.qc-subset-instructions'));
    page.newSubsetInput = page.browser.element(by.css('.qc-new-subset'));
    page.readOnlyNotice = page.browser.element(by.css('.read-only-notice'));
    page.saveNewSubsetBtn = page.browser.element(by.cssContainingText('.qc-add-assessment-group button', 'Save'));
    page.searchAssessmentResults = page.browser.element.all(by.css('.qc-search-assessment-result'));
    page.searchQuestionResults = page.browser.element.all(by.css('.qc-search-question-result'));
    page.setName = page.browser.element(by.css('.qc-view-set-subheader'));
    page.subsetPanels = page.browser.element.all(by.css('.qc-subset-panel'));
    page.togglePublicBtn = page.browser.element(by.css('.qc-toggle-public-btn'));
    page.usersAccordion = page.browser.element(by.cssContainingText('.card-header', 'Show users in this set'));

    //functions
    page.addSubset = addSubset;
    page.clickExportQtiBtn = clickExportQtiBtn;
    page.clickImportQtiBtn = clickImportQtiBtn;
    page.closeFeaturesAccordion = closeFeaturesAccordion;
    page.getAddSubsetBtn = getAddSubsetBtn
    page.getInitialInstructions = getInitialInstructions;
    page.getNewSubsetInput = getNewSubsetInput;
    page.getSearchAssessmentResults = getSearchAssessmentResults;
    page.getSearchBox = getSearchBox;
    page.getSearchQuestionResults = getSearchQuestionResults;
    page.getSetName = getSetName;
    page.getSubset = getSubset;
    page.getSubsets = getSubsets;
    page.getTogglePublicBtn = getTogglePublicBtn;
    page.getUsersAccordion = getUsersAccordion
    page.initSubsets = initSubsets;
    page.isReadOnly = isReadOnly;
    page.openFeaturesAccordion = openFeaturesAccordion;
    page.saveNewSubset = saveNewSubset;
    page.toggleUsersAccordion = toggleUsersAccordion;

    async function addSubset() {
        await page.addSubsetBtn.click();
    }

    async function clickExportQtiBtn() {
        await page.exportQtiBtn.click();
    }

    async function clickImportQtiBtn() {
        await page.importQtiBtn.click();
    }

    async function closeFeaturesAccordion() {
        await page.featuresAccordion.click();
        await page.browser.sleep(1000); //wait for animation to finish so other elements still clickable
    }

    function getAddSubsetBtn() {
        return page.addSubsetBtn;
    }

    function getInitialInstructions() {
        return page.initialInstructions;
    }

    async function getNewSubsetInput() {
        //for some reason, this would occasionally throw an error, saying it was not present?
        await page.browser.wait(EC.presenceOf(page.newSubsetInput), 5000);
        return page.newSubsetInput;
    }

    function getSearchAssessmentResults() {
        return page.searchAssessmentResults;
    }

    function getSearchBox() {
        return page.searchBox;
    }

    function getSearchQuestionResults() {
        return page.searchQuestionResults;
    }

    async function getSetName() {
        return await page.setName.getText();
    }

    function getSubset(index) {
        return this.subsets[index];
    }

    function getSubsets() {
        return page.subsetPanels;
    }

    async function getTogglePublicBtn() {
        await page.browser.wait(EC.presenceOf(page.togglePublicBtn), 5000);
        return page.togglePublicBtn;
    }

    function getUsersAccordion() {
        return page.usersAccordion;
    }

    async function initSubsets() {
        page.subsets = []; //remove previous
        const subsets = await page.getSubsets();
        for (const [index, subset] of subsets.entries()) {
            var thisSubset = page.getSubsets().get(index);
            page.subsets.push(new page.includes.SubsetPanelComponent(page.browser, thisSubset));
        }
    }

    async function isReadOnly() {
        return await page.readOnlyNotice.isPresent();
    }

    async function openFeaturesAccordion() {
        await page.featuresAccordion.click();
        //wait for animation to finish; for now, at least, 3 features, so wait for the last to be visible
        await page.browser.wait(EC.visibilityOf(this.featurePanel.getFeatures().get(2)), 5000);
        await page.browser.sleep(500);
    }

    async function saveNewSubset() {
        var subsetCount,
            newSubset,
            subsetObject;

        await page.saveNewSubsetBtn.click();
        return await page.initSubsets();
    }

    async function toggleUsersAccordion() {
        await page.usersAccordion.click();
        await page.browser.sleep(1000); //wait for animation to finish
    }
};

module.exports = SetPage;