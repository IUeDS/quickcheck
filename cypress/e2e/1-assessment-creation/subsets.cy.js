import { setPage } from '../../support/pages/setPage';
import { SubsetPanelComponent } from '../../support/components/subsetPanelComponent';
import data from '../../support/data/data';

describe('Adding and editing a subset', function () {
    const sets = data.sets;

    before(() => {
        cy.newLocalSet();
    });

    beforeEach(() => {
        const url = data.urls.local.setPage;
        cy.visit(url);
    });

    it('should show the necessary form when the button is clicked', function () {
        setPage.addSubset();
        setPage.getNewSubsetInput().should('be.visible');
    });

    it('should add the subset to the list on the page when saved', function () {
        const name = sets.toBeDeleted.subsets.group1;
        setPage.addSubset();
        setPage.getNewSubsetInput().type(name);
        setPage.saveNewSubset();
        const subset = new SubsetPanelComponent();
        subset.getName().should('eq', name, { matchCase: false });
    });
});

describe('Editing a subset', function () {
    const sets = data.sets;
    let subset;

    before(() => {
        cy.newLocalSet();
        const url = data.urls.local.setPage;
        cy.visit(url);
        const name = sets.toBeDeleted.subsets.group1;
        setPage.addSubset();
        setPage.getNewSubsetInput().type(name);
        setPage.saveNewSubset();
    });

    beforeEach(() => {
        const url = data.urls.local.setPage;
        cy.visit(url);
    });

    it('should initially show instructions for adding a quick check', function () {
        subset = new SubsetPanelComponent();
        subset.areSubsetInstructionsVisible();
    });

    it('should show the edit form when the button is clicked', function () {
        const name = sets.toBeDeleted.subsets.group1;
        subset = new SubsetPanelComponent();

        subset.editSubset();
        subset.getEditSubsetInput().should('have.value', name);
    });

    it('should show the updated name after saving', function () {
        const name = 'Edited subset';
        subset = new SubsetPanelComponent();

        subset.editSubset();
        subset.getEditSubsetInput().clear();
        subset.submitEditedSubset(name);
        subset.getName().should('eq', name, { matchCase: false });
    });

    it('should show the necessary form when the add quick check button is clicked', function () {
        subset = new SubsetPanelComponent();
        
        subset.addQuickCheck();
        subset.getNewQcInput().should('be.visible');
    });

    it('should add the quick check to the subset when saved', function () {
        const name = sets.toBeDeleted.quickchecks.test;
        subset = new SubsetPanelComponent();

        subset.addQuickCheck();
        subset.getNewQcInput().type(name);
        subset.saveQuickCheck();
        const quickchecks = subset.getQuickChecks();
        quickchecks.should('have.length', 1);
        quickchecks.eq(0).invoke('text').should('contain', name, { matchCase: false });
    });
});