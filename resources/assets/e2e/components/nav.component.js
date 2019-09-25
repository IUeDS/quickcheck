var NavComponent = function(browserRef) {
    var component = this;
    component.browser = browserRef;

    component.homeLink = component.browser.element(by.css('.qc-nav-home a'));
    component.resultsLink = component.browser.element(by.css('.qc-nav-results a'));
    component.setsLink = component.browser.element(by.css('.qc-nav-sets a'));

    //functions
    component.goToHome = goToHome;
    component.goToResults = goToResults;
    component.goToSets = goToSets;

    async function goToHome() {
        await component.homeLink.click();
        //ARGH sometimes Protractor refuses to click on this button even when told to,
        //so reclick if home page is not visible yet
        const homepage = await component.browser.element(by.css('.qc-home-page'));
        if (!await homepage.isPresent()) {
            await component.homeLink.click();
        }
        //await component.browser.sleep(1500); //added on 1/4/18, angular started having issues with redirects
    }

    async function goToResults() {
        await component.resultsLink.click();
        //await component.browser.sleep(1500);
    }

    async function goToSets() {
        await component.setsLink.click();
        //await component.browser.sleep(1500);
    }
};

module.exports = NavComponent;