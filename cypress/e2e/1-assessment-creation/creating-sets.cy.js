import { nav } from '../../support/components/navComponent';
import { viewSetsPage } from '../../support/pages/viewSetsPage';
import { setPage } from '../../support/pages/setPage';
import data from '../../support/data/data';

describe('Accessing the list of sets for the first time', function() {
    before(() => {
        cy.refreshLocalDB();
    });

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

describe('Adding a set', () => {
    const sets = data.sets;

    beforeEach(() => {    
        const url = data.urls.local.setsPage;
        cy.visit(url);
    });
  
    it('should show the necessary form when the add set button is clicked', () => {
      // Click the "Add Set" button
      viewSetsPage.clickAddSetBtn();
  
      // Assert that the add set name field is displayed
      viewSetsPage.getAddSetNameField().should('be.visible');
    });
  
    it('should add the set to the user\'s list after being created and hide the form', () => {
      // Fill in the set name and description
      viewSetsPage.clickAddSetBtn();
      viewSetsPage.getAddSetNameField().type(sets.toBeDeleted.name);
      viewSetsPage.getAddDescriptionNameField().type(sets.toBeDeleted.description);
  
      // Save the new set
      viewSetsPage.saveNewSet();
  
      // Get the membership tiles and the new set tile
      const membershipTiles = viewSetsPage.getMembershipTiles();
      const newSet = membershipTiles.first();
  
      // Assert that the new set tile is present
      newSet.should('exist');
      viewSetsPage.getAddSetNameField().should('not.exist');
      viewSetsPage.getInitialInstructions().should('not.exist');
    });
  });
  
// describe('Editing a set', () => {
//     const sets = data.sets;

//     beforeEach(() => {
//         const url = data.urls.local.setsPage;
//         cy.visit(url);
//         const setElement = viewSetsPage.getMembershipTiles().first();
//         // Click the edit button on the first membership tile
//         viewSetsPage.editSet(setElement);
//     });
  
//     it('should show the necessary form when the button is clicked', () => {
//       const setElement = viewSetsPage.getMembershipTiles().first();  
//       const nameInput = viewSetsPage.getEditedNameInput(setElement);
  
//       // Assert that the name input is visible
//       nameInput.should('be.visible');
//     });
  
//     it('should have the correct set name in the editing form', () => {
//       const setElement = viewSetsPage.getMembershipTiles().first();  
//       const nameInput = viewSetsPage.getEditedNameInput(setElement);

//       nameInput.invoke('val').should('eq', sets.toBeDeleted.name)
//     });

//     it('should have the correct set description in the editing form', () => {
//         const setElement = viewSetsPage.getMembershipTiles().first();  

//         const descriptionInput = viewSetsPage.getEditedDescriptionInput(setElement);
//         descriptionInput.invoke('val').should('eq', sets.toBeDeleted.description);
//       });
  
  
//     it('should change the set name in the user\'s list after being saved', () => {
//       const setElement = viewSetsPage.getMembershipTiles().first();
//       const nameInput = viewSetsPage.getEditedNameInput(setElement);

//       nameInput.clear();
//       sets.toBeDeleted.name = 'Edited name';
//       nameInput.type(sets.toBeDeleted.name);
  
//       // Save the set
//       viewSetsPage.updateSet(setElement);
  
//       // Assert that the set name in the membership tile is equal to the edited name
//       viewSetsPage.getSetName(viewSetsPage.getMembershipTiles().first()).should('eq', sets.toBeDeleted.name);
//     });
  
//     it('should change the set description in the user\'s list after being saved', () => {
//       let setElement = viewSetsPage.getMembershipTiles().first();  
//       const descriptionInput = viewSetsPage.getEditedDescriptionInput(setElement);

//       // Clear the description input and enter a new description
//       descriptionInput.clear();
//       sets.toBeDeleted.description = 'Edited description';
//       descriptionInput.type(sets.toBeDeleted.description);

//       // Save the set
//       viewSetsPage.updateSet(setElement);

//       setElement = viewSetsPage.getMembershipTiles().first(); 
//       viewSetsPage.editSet(setElement);
  
//       // Assert that the value of the description input is equal to the edited description
//       viewSetsPage.getEditedDescriptionInput(viewSetsPage.getMembershipTiles().first()).invoke('val').should('eq', sets.toBeDeleted.description);
//     });
  
//     it('should hide the form when canceling an edit', () => {
//       // Cancel the set edit
//       viewSetsPage.cancelSetEdit(viewSetsPage.getMembershipTiles().first());
  
//       // Assert that the name input is not visible
//       viewSetsPage.getEditedNameInput(viewSetsPage.getMembershipTiles().first()).should('not.exist');
//     });
//   });
  
//   describe('Viewing a set', () => {
//     beforeEach(() => {
//       // Initialize the page objects and navigate to the sets page
//       const url = data.urls.local.setsPage;
//       cy.visit(url);
//     });
  
//     it('should initially show instructions for adding a subset', () => {
//       const setBtn = viewSetsPage.getGoToSetBtn(viewSetsPage.getMembershipTiles().first());
//       // Click the set button
//       setBtn.click();
  
//       // Assert that the initial instructions are displayed
//       setPage.getInitialInstructions().should('be.visible');
//     });
//   });