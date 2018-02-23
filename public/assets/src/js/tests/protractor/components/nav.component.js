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

    function goToHome() {
        component.homeLink.click();
        component.browser.sleep(1000); //added on 1/4/18, angular started having issues with redirects
    }

    function goToResults() {
        component.resultsLink.click();
        component.browser.sleep(1000);
    }

    function goToSets() {
        component.setsLink.click();
        component.browser.sleep(1000);
    }
};

module.exports = NavComponent;