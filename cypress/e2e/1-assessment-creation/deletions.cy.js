import { viewSetsPage } from '../../support/pages/viewSetsPage';
import { setPage } from '../../support/pages/setPage';
import data from '../../support/data/data';
import { SubsetPanelComponent } from '../../support/components/subsetPanelComponent';

describe('Deleting', function () {
    before(() => {
        cy.newLocalAssessment();
    });

    it('a quick check from a subset should remove the quick check from the page', function () {
        const url = data.urls.local.setPage;
        cy.visit(url);
        const subset = new SubsetPanelComponent();
        const quickCheck = subset.getQuickChecks().eq(0);
        subset.deleteQuickCheck(quickCheck);
        cy.on('window:confirm', () => true);
        subset.getQuickChecks().should('have.length', 0);
    });

    it('a subset should remove the subset from the page', function () {
        const url = data.urls.local.setPage;
        cy.visit(url);
        const subset = new SubsetPanelComponent();
        subset.deleteSubset();
        cy.on('window:confirm', () => true);
        setPage.getSubsets().should('have.length', 0); 
    });

    it('a set should remove the collection from the user\'s list after deletion', function () {
        const url = data.urls.local.setsPage;
        cy.visit(url);
        viewSetsPage.deleteSet(viewSetsPage.getMembershipTiles().eq(0));
        cy.on('window:confirm', () => true);
        viewSetsPage.getMembershipTiles().should('have.length', 0); 
    });
});