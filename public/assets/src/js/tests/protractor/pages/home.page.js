var HomePage = function(browserRef) {
    var page = this;
    page.browser = browserRef;
    page.includes = require('../common/includes.js');

    //subcomponents
    page.nav = new page.includes.NavComponent(page.browser);

    //elements
    page.addQcBtn = page.browser.element(by.css('.qc-hero-add-btn'));
    page.newQuickCheckInput = page.browser.element(by.css('#assessment-name'));
    page.newSetInput = page.browser.element(by.css('#collection-name'));
    page.newSubsetInput = page.browser.element(by.css('#assessment-group-name'));
    page.pageHeader = page.browser.element(by.css('h1'));
    page.saveBtn = page.browser.element(by.partialButtonText('Save'));
    page.setOptions = page.browser.element.all(by.repeater('membership in vm.memberships'));
    page.setSelect = page.browser.element(by.css('#collection-select'));
    page.subsetOptions = page.browser.element.all(by.repeater('assessmentGroup in vm.selectedCollection.assessment_groups'));
    page.subsetSelect = page.browser.element(by.css('#assessment-group-select'));

    //string selectors
    page.newSetText = '[Add new set]';
    page.newSubsetText = '[Add new subset]';

    //functions
    page.addQuickCheck = addQuickCheck;
    page.getHeader = getHeader;
    page.getNewSetInput = getNewSetInput;
    page.getNewSubsetInput = getNewSubsetInput;
    page.getSetOptions = getSetOptions;
    page.getSubsetOptions = getSubsetOptions;
    page.saveNewQuickCheck = saveNewQuickCheck;
    page.selectNewSet = selectNewSet;
    page.selectNewSubset = selectNewSubset;
    page.selectSet = selectSet;
    page.selectSubset = selectSubset;

    function addQuickCheck() {
        page.addQcBtn.click();
    }

    function getHeader() {
        return page.pageHeader.getText();
    }

    function getNewSetInput() {
        return page.newSetInput;
    }

    function getNewSubsetInput() {
        return page.newSubsetInput;
    }

    function getSetOptions() {
        return page.setOptions;
    }

    function getSubsetOptions() {
        return page.subsetOptions;
    }

    function saveNewQuickCheck(quickCheckName) {
        page.newQuickCheckInput.sendKeys(quickCheckName);
        page.saveBtn.click();
        page.browser.sleep(2000);
    }

    function selectNewSet() {
        page.setSelect.sendKeys(page.newSetText);
    }

    function selectNewSubset() {
        page.subsetSelect.sendKeys(page.newSubsetText);
    }

    function selectSet(setName) {
        page.setSelect.sendKeys(setName);
    }

    function selectSubset(subsetName) {
        page.subsetSelect.sendKeys(subsetName);
    }
};

module.exports = HomePage;