var EmbedPage = function(browserRef) {
    var page = this;
    page.browser = browserRef;
    page.includes = require('../common/includes.js');
    page.common = new page.includes.Common(page.browser);

    //elements
    page.adminToggleViewAll = page.browser.element(by.css('.qc-admin-all-sets-toggle'));
    page.adminSets = page.browser.element.all(by.repeater('collection in vm.adminCollectionData.collections'));
    page.clearSearchBtn = page.browser.element(by.css('.qc-select-clear-search'));
    page.quickchecks = page.browser.element.all(by.repeater('assessment in assessmentGroup.assessments'));
    page.memberships = page.browser.element.all(by.repeater('membership in vm.memberships'));
    page.searchResults = page.browser.element.all(by.repeater('assessment in vm.search.searchResults'));
    page.searchBox = page.browser.element(by.css('#assessment-search'));
    page.subsets = page.browser.element.all(by.repeater('assessmentGroup in vm.collection.assessment_groups'));

    //sub-string selectors
    page.previewBtn = '.qc-select-preview-btn';
    page.selectBtn = '.qc-select-btn';

    //functions
    page.clearSearch = clearSearch;
    page.getAdminSets = getAdminSets;
    page.getQuickChecks = getQuickChecks;
    page.getSearchResults = getSearchResults;
    page.getSets = getSets;
    page.getSubsets = getSubsets;
    page.previewQuickCheckByIndex = previewQuickCheckByIndex;
    page.search = search;
    page.selectQuickCheckByIndex = selectQuickCheckByIndex;
    page.selectSearchedQuickCheckByIndex = selectSearchedQuickCheckByIndex;
    page.toggleAdminViewAll = toggleAdminViewAll;

    function clearSearch() {
        page.clearSearchBtn.click();
    }

    function getAdminSets() {
        return page.adminSets;
    }

    function getQuickChecks() {
        return page.quickchecks;
    }

    function getSearchResults() {
        return page.searchResults;
    }

    function getSets() {
        return page.memberships;
    }

    function getSubsets() {
        return page.subsets;
    }

    function previewQuickCheckByIndex(index) {
        page.getQuickChecks().get(index).element(by.css(page.previewBtn)).click();
    }

    function search(searchTerm) {
        page.searchBox.sendKeys(searchTerm);
    }

    function selectQuickCheckByIndex(index) {
        page.getQuickChecks().get(index).element(by.css(page.selectBtn)).click();
    }

    function selectSearchedQuickCheckByIndex(index) {
        page.getSearchResults().get(index).element(by.css(page.selectBtn)).click();
        page.browser.sleep(1000);
    }

    function toggleAdminViewAll() {
        page.adminToggleViewAll.click();
    }
}

module.exports = EmbedPage;