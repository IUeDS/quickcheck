var FeaturePanelComponent = function(browserRef) {
    var component = this;
    component.browser = browserRef;

    //elements
    component.features = component.browser.element.all(by.repeater('collectionFeature in vm.collectionFeatures'));

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

    function getFeatureTitle(feature) {
        return feature.element(by.css(component.featureTitle)).getText();
    }

    function isFeatureOn(feature) {
        return feature.element(by.css('input')).getAttribute('checked');
    }

    function isFeatureToggleable(feature) {
        return feature.element(by.css('input')).isPresent();
    }

    function toggleFeature(feature) {
        feature.element(by.css(component.clickableToggle)).click();
    }

    function toggleFeatureByIndex(index) {
        component.features.get(index).element(by.css(component.clickableToggle)).click();
    }
}

module.exports = FeaturePanelComponent;