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
        set = viewSetsPage.getMembershipTiles().first();
        viewSetsPage.getGoToSetBtn(set).click();
        setPage.openFeaturesAccordion();
        features = setPage.featurePanel.getFeatures();
        expect(features.count()).toBe(featureCount);
    });

    it('should show the correct name for admin-only features', function() {
        //timeout feature only for now
        feature = features.get(featureCount - 1);
        expect(setPage.featurePanel.getFeatureTitle(feature)).toContain(adminFeatures[0]);
    });

    it('should default the attempt timeout feature to off', function() {
        expect(setPage.featurePanel.isFeatureOn(feature)).toBeFalsy();
    });

    it('should allow an admin to toggle an admin-only feature', function() {
        //keep this on for timeout testing
        setPage.featurePanel.toggleFeature(feature);
        expect(setPage.featurePanel.isFeatureOn(feature)).toBeTruthy();
        setPage.nav.goToSets();
    });
});