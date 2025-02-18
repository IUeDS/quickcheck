import { SubsetPanelComponent } from "../components/subsetPanelComponent";

export class SetPage {
    // this.includes = require('../common/includes.js');
    // this.common = new this.includes.Common();

    // //sub-components
    // this.featurePanel = new this.includes.FeaturePanelComponent();
    // this.nav = new this.includes.NavComponent();
    // this.qtiExport = new this.includes.QtiExportComponent();
    // this.qtiImport = new this.includes.QtiImportComponent();
    // this.subsets = [];
    //this.userPanel = new this.includes.UserPanelComponent();

    constructor() {
        //elements
        this.addSubsetBtn = () => cy.contains('button', 'Add new subset');
        this.exportQtiBtn = () => cy.get('.qc-btn-qti-export');
        this.featuresAccordion = () => cy.contains('.card-header', 'Show features in this set');
        this.searchBox = () => cy.get('.qc-search-box');
        this.importQtiBtn = () => cy.get('.qc-btn-qti-import');
        this.initialInstructions = () => cy.get('.qc-subset-instructions');
        this.newSubsetInput = () => cy.get('.qc-new-subset');
        this.readOnlyNotice = () => cy.get('.read-only-notice');
        this.saveNewSubsetBtn = () => cy.contains('.qc-add-assessment-group button', 'Save');
        this.searchAssessmentResults = () => cy.get('.qc-search-assessment-result');
        this.searchQuestionResults = () => cy.get('.qc-search-question-result');
        this.setName = () => cy.get('.qc-view-set-subheader');
        this.subsetPanels = () => cy.get('.qc-subset-panel');
        this.togglePublicBtn = () => cy.get('.qc-toggle-public-btn');
        this.usersAccordion = () => cy.contains('.card-header', 'Show users in this set');
    }

    addSubset() {
        this.addSubsetBtn().click();
    }

    clickExportQtiBtn() {
        this.exportQtiBtn().click();
    }

    clickImportQtiBtn() {
        this.importQtiBtn().click();
    }

    closeFeaturesAccordion() {
        this.featuresAccordion().click();
        cy.wait(1000); //wait for animation to finish so other elements still clickable
    }

    getAddSubsetBtn() {
        return this.addSubsetBtn();
    }

    getInitialInstructions() {
        return this.initialInstructions();
    }

    getNewSubsetInput() {
        //for some reason, this would occasionally throw an error, saying it was not present?
        this.newSubsetInput().should('be.visible');
        return this.newSubsetInput();
    }

    getSearchAssessmentResults() {
        return this.searchAssessmentResults();
    }

    getSearchBox() {
        return this.searchBox();
    }

    getSearchQuestionResults() {
        return this.searchQuestionResults();
    }

    getSetName() {
        return this.setName().invoke('text');
    }

    getSubset(index) {
        return this.subsets[index];
    }

    getSubsets() {
        return this.subsetPanels();
    }

    getTogglePublicBtn() {
        this.togglePublicBtn().should('be.visible');
        return this.togglePublicBtn();
    }

    getUsersAccordion() {
        return this.usersAccordion();
    }

    initSubsets() {
        this.subsets = []; //remove previous

        //NOTE: can't seem to get this to work. Going to default to 
        //using the subsetPanelComponent and having just one per page.
        this.getSubsets().each((subset, index, $list) => {
            //cy.log('this subset', subset);
            this.subsets.push(new SubsetPanelComponent(subset));
        });
        //cy.log('this subsets', this.subsets);
    }

    isReadOnly() {
        return this.readOnlyNotice().should('exist');
    }

    openFeaturesAccordion() {
        this.featuresAccordion().click();
        cy.wait(500); //wait for animation to finish 
    }

    saveNewSubset() {
        this.saveNewSubsetBtn().click();
        //return this.initSubsets();
    }

    toggleUsersAccordion() {
        this.usersAccordion().click();
    }
};

export const setPage = new SetPage();