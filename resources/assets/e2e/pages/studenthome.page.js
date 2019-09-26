var StudentHomePage = function(browserRef) {
    var page = this;
    page.browser = browserRef;
    page.includes = require('../common/includes.js');

    //sub-components
    page.attempts = new page.includes.AttemptsTableComponent(page.browser);
    page.responses = new page.includes.ResponsesComponent(page.browser);

    //elements
    page.releases = page.browser.element.all(by.css('.qc-releases-release'));
    page.searchBox = page.browser.element(by.css('.qc-search-box'));

    //functions
    page.clearSearch = clearSearch;
    page.getDisplayedReleases = getDisplayedReleases;
    page.getReleases = getReleases;
    page.getSearch = getSearch;
    page.search = search;

    async function clearSearch() {
        await page.searchBox.clear();
        //9/26/19: apparently clear() was not enough to trigger the angular model! so frustrating!
        //seems to waiting for some sort of keyup stroke or something that isn't triggered by selenium
        await page.searchBox.sendKeys('a');
        await page.searchBox.sendKeys(protractor.Key.BACK_SPACE);
    }

    async function getDisplayedReleases() {
        return await page.releases.filter(async function(release) {
            return await release.isDisplayed();
        });
    }

    function getReleases() {
        return page.releases;
    }

    function getSearch() {
        return page.searchBox;
    }

    async function search(text) {
        await page.searchBox.sendKeys(text);
    }
};

module.exports = StudentHomePage;