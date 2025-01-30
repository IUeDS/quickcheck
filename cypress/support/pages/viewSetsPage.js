export class ViewSetsPage {
    constructor() {
  
      // Selectors (for nested elements)
      this.cancelSetEditText = 'Cancel';
      this.deleteSetBtn = '.qc-collection-delete-btn';
      this.editSetBtn = '.qc-collection-edit-btn';
      this.editSetDescriptionField = '.qc-collection-edit-description';
      this.editSetNameField = '.qc-collection-edit-name';
      this.goToSetText = 'Go to set';
      this.newTabBtn = '.qc-view-new-tab-btn';
      this.publicJoinBtn = '.qc-join-btn';
      this.publicOptOutBtn = '.qc-opt-out-btn';
      this.publicViewBtn = '.qc-view-set-btn';
      this.saveUpdatedSetText = 'Save';
      this.setName = 'h2';

      //functions
      this.addAdminUser = () => this.addAdminUserBtn.click();
      this.cancelSetEdit = (setElement) => setElement.get('button').contains(this.cancelSetEditText).click();
      this.clearSearch = () => {
        this.searchBox.clear();
        // Manually trigger search by sending a keypress
        this.searchBox.type('a');
        this.searchBox.type('{backspace}');
      };
      this.clickAddSetBtn = () => this.addSetBtn.click();
      this.deleteSet = (setElement) => setElement.find(this.deleteSetBtn).click();
      this.editSet = (setElement) => setElement.find(this.editSetBtn).click();
      this.getAddDescriptionNameField = () => this.newSetDescriptionField;
      this.getAdminSetTiles = () => this.adminSetTiles;
      this.getAdminUserInput = () => this.adminUserInput;
      this.getAdminUserSuccess = () => this.adminUserValidationSuccess;
      this.getAdminUserValidationError = () => this.adminUserValidationError;
      this.getAddSetNameField = () => this.newSetNameField;
      this.getEditedDescriptionInput = (setElement) => setElement.find(this.editSetDescriptionField);
      this.getEditedNameInput = (setElement) => setElement.find(this.editSetNameField);
      this.getGoToSetBtn = (setElement) => setElement.get('.qc-view-set-btn');
      this.getGoToSetNewTabBtn = (setElement) => setElement.find(this.newTabBtn);
      this.getInitialInstructions = () => this.initialInstructions;
      this.getMembershipTiles = () => this.membershipTiles;
      this.getNoPublicSetsMsg = () => this.noPublicSetsMsg;
      this.getPublicJoinBtn = (set) => set.find(this.publicJoinBtn);
      this.getPublicOptOutBtn = (set) => set.find(this.publicOptOutBtn);
      this.getPublicSets = () => this.publicSets;
      this.getPublicViewBtn = (set) => set.find(this.publicViewBtn);
      this.getSearchBox = () => this.searchBox;
      this.getSetName = (setElement) => setElement.find(this.setName).invoke('text');
      this.isSetPublic = (set) => set.text().includes('Public');
      this.saveNewSet = () => this.saveNewSetBtn.click();
      this.submitAdminUser = () => this.submitAdminUserBtn.click();
      this.toggleAdminViewAllSets = () => this.adminViewAllToggle.click();
      this.togglePublicSets = () => this.togglePublicSetsBtn.click();
      this.updateSet = (setElement) => setElement.get('button').contains('Save').click();
      
    }

    //getters
      get addAdminUserBtn() {
        return cy.get('[partialButtonText="Add admin user"]');
      }
    
      get addSetBtn() {
        return cy.get('.qc-btn-add-set');
      }
    
      get adminSetTiles() {
        return cy.get('.qc-collection-tile');
      }
    
      get adminUserInput() {
        return cy.get('#username');
      }
    
      get adminUserValidationError() {
        return cy.get('p').contains('User cannot be found. Please try again.');
      }
    
      get adminUserValidationSuccess() {
        return cy.get('.qc-admin-add-user-success');
      }
    
      get adminViewAllToggle() {
        return cy.get('.qc-admin-all-sets-toggle');
      }
    
      get initialInstructions() {
        return cy.get('.qc-collection-instructions');
      }
    
      get membershipTiles() {
        return cy.get('.qc-collection-tile');
      }
    
      get newSetDescriptionField() {
        return cy.get('#collection-description');
      }
    
      get newSetNameField() {
        return cy.get('#collection-name');
      }
    
      get noPublicSetsMsg() {
        return cy.get('.qc-no-public-sets');
      }
    
      get publicSets() {
        return cy.get('.qc-public-collection');
      }
    
      get saveNewSetBtn() {
        return cy.get('.qc-save-collection-btn');
      }
    
      get searchBox() {
        return cy.get('.qc-search-box');
      }
    
      get submitAdminUserBtn() {
        return cy.get('[partialButtonText="Validate username and save"]');
      }
    
      get togglePublicSetsBtn() {
        return cy.get('.qc-view-public-btn');
      }
  }
  
  export const viewSetsPage = new ViewSetsPage();