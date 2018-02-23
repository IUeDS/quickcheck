var includes = require('../common/includes.js'),
    data = includes.data,
    setPage = new includes.SetPage(browser);

describe('Viewing features for a collection', function () {
    var features;

    it('should show the toggle-able features', function () {
        setPage.openFeaturesAccordion();
        features = setPage.featurePanel.getFeatures();
        data.featureNames.forEach(function (featureName, index) {
            var feature = features.get(index);
            expect(setPage.featurePanel.getFeatureTitle(feature)).toContain(featureName);
        });
    });

    it('should default automatic grade passback to ON', function () {
        var feature = features.get(0);
        expect(setPage.featurePanel.isFeatureOn(feature)).toBeTruthy();
    });

    it('should default hiding empty attempts to OFF', function () {
        var feature = features.get(1);
        expect(setPage.featurePanel.isFeatureOn(feature)).toBeFalsy();
    });

    it('should default to showing responses in student view to ON', function () {
        var feature = features.get(2);
        expect(setPage.featurePanel.isFeatureOn(feature)).toBeTruthy();
    });

    it('should save a feature after the feature is toggled and the page refreshed', function () {
        var feature = features.get(1);
        setPage.featurePanel.toggleFeature(feature);
        browser.refresh().then(function() {
            setPage.openFeaturesAccordion();
            //reload variable so we don't get stale reference error
            features = setPage.featurePanel.getFeatures();
            var feature = features.get(1);
            expect(setPage.featurePanel.isFeatureOn(feature)).toBeTruthy();
            setPage.closeFeaturesAccordion();
        });
    });
});