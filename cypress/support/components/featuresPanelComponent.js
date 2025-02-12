export class FeaturesPanelComponent {
    constructor() {
        //elements
        this.features = () => cy.get('.qc-feature');

        //string references (for ad-hoc sub-elements)
        this.featureTitle = 'h3';
        this.clickableToggle = 'label';
    }

    getFeatures() {
        return this.features();
    }

    getFeatureTitle(feature) {
        return feature.find(this.featureTitle).invoke('text');
    }

    isFeatureOff(feature) {
        return feature.find('input').should('not.be.checked');
    }

    isFeatureOn(feature) {
        return feature.find('input').should('be.checked');
    }

    isFeatureToggleable(feature) {
        return feature.find('input').should('exist');
    }

    toggleFeature(feature) {
        feature.find(this.clickableToggle).click();
    }

    toggleFeatureByIndex(index) {
        this.features().eq(index).find(this.clickableToggle).click();
    }
}

export const featuresPanel = new FeaturesPanelComponent();