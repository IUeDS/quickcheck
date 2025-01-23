//import { NavComponent } from '../../support/components/navComponent';
import { nav } from '../../support/components/navComponent';
import { viewSetsPage } from '../../support/pages/viewSetsPage';
import data from '../../support/data/data';

describe('Accessing the list of sets for the first time', function() {
    beforeEach(() => {
        const url = data.urls.local.setsPage;
        cy.visit(url);
    });

    it('should show no sets, but instead a message with instructions', () => { 
        viewSetsPage.getInitialInstructions().should('exist');
        viewSetsPage.getMembershipTiles().should('have.length', 0);
    });


    it('should show no sets, but instead a message with instructions', () => { 
        viewSetsPage.getSearchBox().should('not.exist');
    });
});