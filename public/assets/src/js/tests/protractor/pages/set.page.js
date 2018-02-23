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
    page.featuresAccordion = page.browser.element(by.cssContainingText('.panel-heading', 'Show features in this set'));
    page.searchBox = page.browser.element(by.css('.qc-search-box'));
    page.importQtiBtn = page.browser.element(by.css('.qc-btn-qti-import'));
    page.initialInstructions = page.browser.element(by.css('.qc-subset-instructions'));
    page.newSubsetInput = page.browser.element(by.model('vm.newAssessmentGroup.name'));
    page.readOnlyNotice = page.browser.element(by.css('.read-only-notice'));
    page.saveNewSubsetBtn = page.browser.element(by.cssContainingText('.qc-add-assessment-group button', 'Save'));
    page.searchAssessmentResults = page.browser.element.all(by.css('.qc-search-assessment-result'));
    page.searchQuestionResults = page.browser.element.all(by.css('.qc-search-question-result'));
    page.setName = page.browser.element(by.css('.qc-view-set-subheader'));
    page.subsetPanels = page.browser.element.all(by.repeater('assessmentGroup in vm.assessmentGroups'));
    page.togglePublicBtn = page.browser.element(by.css('.qc-toggle-public-btn'));
    page.usersAccordion = page.browser.element(by.cssContainingText('.panel-heading', 'Show users in this set'));

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

    function addSubset() {
        page.addSubsetBtn.click();
    }

    function clickExportQtiBtn() {
        page.exportQtiBtn.click();
    }

    function clickImportQtiBtn() {
        page.importQtiBtn.click();
    }

    function closeFeaturesAccordion() {
        page.featuresAccordion.click();
        page.browser.sleep(1000); //wait for animation to finish so other elements still clickable
    }

    function getAddSubsetBtn() {
        return page.addSubsetBtn;
    }

    function getInitialInstructions() {
        return page.initialInstructions;
    }

    function getNewSubsetInput() {
        //for some reason, this would occasionally throw an error, saying it was not present?
        page.browser.wait(EC.presenceOf(page.newSubsetInput), 5000);
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

    function getSetName() {
        return page.setName.getText();
    }

    function getSubset(index) {
        return this.subsets[index];
    }

    function getSubsets() {
        return page.subsetPanels;
    }

    function getTogglePublicBtn() {
        return page.togglePublicBtn;
    }

    function getUsersAccordion() {
        return page.usersAccordion;
    }

    function initSubsets() {
        page.subsets = []; //remove previous
        return page.getSubsets().then(function(subsets) {
            subsets.forEach(function(subset, index) {
                var thisSubset = page.getSubsets().get(index);
                page.subsets.push(new page.includes.SubsetPanelComponent(page.browser, thisSubset));
            });
        });
    }

    function isReadOnly() {
        return page.readOnlyNotice.isPresent();
    }

    function openFeaturesAccordion() {
        //I hate to do this, but sometimes the bootstrap js has not properly loaded and the tests fail,
        //so adding in a brief sleep to make sure that js has initialized from what's in the DOM;
        page.browser.sleep(1000);
        page.featuresAccordion.click();
        //wait for animation to finish; for now, at least, 3 features, so wait for the last to be visible
        page.browser.wait(EC.visibilityOf(this.featurePanel.getFeatures().get(2)), 5000);
    }

    function saveNewSubset() {
        var subsetCount,
            newSubset,
            subsetObject;

        page.saveNewSubsetBtn.click();
        return page.initSubsets();
    }

    function toggleUsersAccordion() {
        page.usersAccordion.click();
    }
};

module.exports = SetPage;