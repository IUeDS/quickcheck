var StudentHomePage = function(browserRef) {
    var page = this;
    page.browser = browserRef;
    page.includes = require('../common/includes.js');

    //sub-components
    page.attempts = new page.includes.AttemptsTableComponent(page.browser);
    page.responses = new page.includes.ResponsesComponent(page.browser);

    //elements
    page.releases = page.browser.element.all(by.repeater('release in vm.releases'));
    page.searchBox = page.browser.element(by.css('.qc-search-box'));

    //functions
    page.clearSearch = clearSearch;
    page.getDisplayedReleases = getDisplayedReleases;
    page.getReleases = getReleases;
    page.search = search;

    async function clearSearch() {
        await page.searchBox.clear();
    }

    async function getDisplayedReleases() {
        return page.releases.filter(async function(release) {
            return await release.isDisplayed();
        });
    }

    function getReleases() {
        return page.releases;
    }

    async function search(text) {
        await page.searchBox.sendKeys(text);
    }
};

module.exports = StudentHomePage;