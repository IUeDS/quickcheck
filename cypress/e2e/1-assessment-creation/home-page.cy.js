import data from '../../support/data/data';
import { viewSetsPage } from '../../support/pages/viewSetsPage';
import { setPage } from '../../support/pages/setPage';
import { editQcPage } from '../../support/pages/editQcPage';
import { homePage } from '../../support/pages/homePage';

describe('Adding a new set, subset, and quick check from the home page', () => {
  const setName = data.sets.featuresAllOn.name;
  const subsetName = data.sets.featuresAllOn.subsets.group1;
  const quickCheckName = data.sets.featuresAllOn.quickchecks.featuresAllOn;

    it('should show existing set and subset information', () => {
        cy.newLocalAssessment();
        const url = data.urls.local.homePage;
        cy.visit(url);

        homePage.addQuickCheck();
        homePage.getSetOptions().should('have.length', 1);
        homePage.selectSet(data.sets.toBeDeleted.name);
        homePage.getSubsetOptions().should('have.length', 1);
    });

  it('should show inputs when a new set is selected', () => {
    cy.refreshLocalDB();
    const url = data.urls.local.homePage;
    cy.visit(url);

    homePage.addQuickCheck();
    homePage.selectNewSet();
    homePage.getNewSetInput().should('be.visible')
    homePage.getNewSubsetInput().should('be.visible');
  });

  it('should redirect to the new quick check after saving and include correct data', () => {
    const url = data.urls.local.homePage;
    cy.visit(url);

    homePage.addQuickCheck();
    homePage.selectNewSet();
    homePage.getNewSetInput().type(setName);
    homePage.getNewSubsetInput().type(subsetName);
    homePage.saveNewQuickCheck(quickCheckName);

    editQcPage.getAssessmentName().should('eq', quickCheckName);
    editQcPage.getSubsetSelect().find('option:selected').invoke('text').then((selectedText) => {
        expect(selectedText).to.eq(subsetName);
    });
  });

  it('should correctly save the subset', () => {
    const url = data.urls.local.setPage;
    cy.visit(url);

    setPage.getSubsets().first().then(($subset) => {
      expect($subset.text()).to.contain(subsetName);
    });
  });

  it('should correctly save the set', () => {
    const url = data.urls.local.setsPage;
    cy.visit(url);

    viewSetsPage.getSetName(viewSetsPage.getMembershipTiles().eq(0)).should('eq', setName);
  });
});