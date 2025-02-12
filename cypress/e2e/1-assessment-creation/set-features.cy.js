import { setPage } from '../../support/pages/setPage';
import data from '../../support/data/data';
import { featuresPanel } from '../../support/components/featuresPanelComponent';

describe('Viewing features for a set', function () {
    before(() => {
        cy.newLocalSet();
    });

    beforeEach(() => {
        const url = data.urls.local.setPage;
        cy.visit(url);
        setPage.openFeaturesAccordion();
    });

    it('should show the toggle-able features', function () {
        data.featureNames.forEach(function (featureName, index) {
            const feature = featuresPanel.getFeatures().eq(index);
            featuresPanel.getFeatureTitle(feature).then(title => {
                expect(title.toLowerCase()).to.contain(featureName.toLowerCase());
            });
        });
    });

    it('should default features to appropriate on or off settings', function () {
        featuresPanel.isFeatureOn(featuresPanel.getFeatures().eq(0)); //automatic grade passback
        featuresPanel.isFeatureOff(featuresPanel.getFeatures().eq(1)); //hiding empty attempts
        featuresPanel.isFeatureOn(featuresPanel.getFeatures().eq(2)); //showing responses in student view
        featuresPanel.isFeatureOn(featuresPanel.getFeatures().eq(3)); //timeout for excessive attempts
    });

    it('should save a feature after the feature is toggled and the page refreshed', function () {
        let features = featuresPanel.getFeatures();
        let feature = features.eq(1);
        featuresPanel.toggleFeature(feature);
        cy.reload();
        setPage.openFeaturesAccordion();
        features = featuresPanel.getFeatures();
        feature = features.eq(1);
        featuresPanel.isFeatureOn(feature);
    });
});