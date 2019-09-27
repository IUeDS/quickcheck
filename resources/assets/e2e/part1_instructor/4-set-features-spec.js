var includes = require('../common/includes.js'),
    data = includes.data,
    setPage = new includes.SetPage(browser);

describe('Viewing features for a collection', function () {
    var features;

    it('should show the toggle-able features', async function () {
        await setPage.openFeaturesAccordion();
        features = setPage.featurePanel.getFeatures();
        data.featureNames.forEach(async function (featureName, index) {
            var feature = features.get(index);
            const title = await setPage.featurePanel.getFeatureTitle(feature);
            expect(title).toContain(featureName);
        });
    });

    it('should default automatic grade passback to ON', async function () {
        var feature = features.get(0);
        expect(await setPage.featurePanel.isFeatureOn(feature)).toBeTruthy();
    });

    it('should default hiding empty attempts to OFF', async function () {
        var feature = features.get(1);
        expect(await setPage.featurePanel.isFeatureOn(feature)).toBeFalsy();
    });

    it('should default to showing responses in student view to ON', async function () {
        var feature = features.get(2);
        expect(await setPage.featurePanel.isFeatureOn(feature)).toBeTruthy();
    });

    it('should default timeout for excessive attempts to ON', async function() {
        var feature = features.get(3);
        expect(await setPage.featurePanel.isFeatureOn(feature)).toBeTruthy();
    });

    it('should save a feature after the feature is toggled and the page refreshed', async function () {
        var feature = features.get(1);
        await setPage.featurePanel.toggleFeature(feature);
        await browser.refresh();
        await setPage.openFeaturesAccordion();
        //reload variable so we don't get stale reference error
        features = setPage.featurePanel.getFeatures();
        var feature = features.get(1);
        expect(await setPage.featurePanel.isFeatureOn(feature)).toBeTruthy();
        await setPage.closeFeaturesAccordion();
    });
});