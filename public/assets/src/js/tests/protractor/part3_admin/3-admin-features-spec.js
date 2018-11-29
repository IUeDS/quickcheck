var browser3 = browser.params.browser3, //define browser instance from global value
    EC = protractor.ExpectedConditions,
    includes = require('../common/includes.js'),
    common = new includes.Common(browser3),
    data = includes.data,
    setPage = new includes.SetPage(browser3),
    viewSetsPage = new includes.ViewSetsPage(browser3);

describe('Viewing set features as an admin', function() {
    var features,
        feature,
        adminFeatures = data.featureNamesAdmin,
        standardFeatures = data.featureNames,
        featureCount = adminFeatures.length + standardFeatures.length;

    it('should show both standard features and admin-only features', function() {
        viewSetsPage.toggleAdminViewAllSets();
        set = viewSetsPage.getAdminSetTiles().first();
        viewSetsPage.getGoToSetBtn(set).click();
        setPage.openFeaturesAccordion();
        features = setPage.featurePanel.getFeatures();
        expect(features.count()).toBe(featureCount);
        setPage.nav.goToSets();
    });

    // MM, 11/21/18: the timeout feature is no longer admin-only, but we may need this test
    // again if we add additional admin only features in the future.
    // it('should show the correct name for admin-only features', function() {
    //     //timeout feature only for now
    //     feature = features.get(featureCount - 1);
    //     expect(setPage.featurePanel.getFeatureTitle(feature)).toContain(adminFeatures[0]);
    // });

    // it('should allow an admin to toggle a feature', function() {
    //     //keep this on for timeout testing
    //     feature = features.get(featureCount - 1);
    //     setPage.featurePanel.toggleFeature(feature);
    //     expect(setPage.featurePanel.isFeatureOn(feature)).toBeTruthy();
    //     setPage.nav.goToSets();
    // });
});