var FeaturePanelComponent = function(browserRef) {
    var component = this;
    component.browser = browserRef;

    //elements
    component.features = component.browser.element.all(by.css('.qc-feature'));

    //string references (for ad-hoc sub-elements)
    component.featureTitle = 'h3';
    component.clickableToggle = 'label';

    //functions
    component.getFeatures = getFeatures;
    component.getFeatureTitle = getFeatureTitle;
    component.isFeatureOn = isFeatureOn;
    component.isFeatureToggleable = isFeatureToggleable;
    component.toggleFeature = toggleFeature;
    component.toggleFeatureByIndex = toggleFeatureByIndex;

    function getFeatures() {
        return component.features;
    }

    async function getFeatureTitle(feature) {
        return await feature.element(by.css(component.featureTitle)).getText();
    }

    async function isFeatureOn(feature) {
        return await feature.element(by.css('input')).getAttribute('checked');
    }

    async function isFeatureToggleable(feature) {
        return await feature.element(by.css('input')).isPresent();
    }

    async function toggleFeature(feature) {
        await feature.element(by.css(component.clickableToggle)).click();
    }

    async function toggleFeatureByIndex(index) {
        await component.features.get(index).element(by.css(component.clickableToggle)).click();
    }
}

module.exports = FeaturePanelComponent;