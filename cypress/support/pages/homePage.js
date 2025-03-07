export class HomePage {
    constructor() {
        // elements
        this.addQcBtn = '.qc-hero-add-btn';
        this.newQuickCheckInput = '#assessment-name';
        this.newSetInput = '#collection-name';
        this.newSubsetInput = '#assessment-group-name';
        this.pageHeader = 'h1';
        this.saveBtn = 'button:contains("Save")';
        this.setOptions = '.qc-home-membership';
        this.setSelect = '#collection-select';
        this.subsetOptions = '.qc-home-assessment-group';
        this.subsetSelect = '#assessment-group-select';

        // string selectors
        this.newSetText = '[Add new set]';
        this.newSubsetText = '[Add new subset]';
    }

    addQuickCheck() {
        cy.get(this.addQcBtn).click();
    }

    getHeader() {
        return cy.get(this.pageHeader).invoke('text');
    }

    getNewSetInput() {
        return cy.get(this.newSetInput);
    }

    getNewSubsetInput() {
        return cy.get(this.newSubsetInput);
    }

    getSetOptions() {
        return cy.get(this.setOptions);
    }

    getSubsetOptions() {
        return cy.get(this.subsetOptions);
    }

    saveNewQuickCheck(quickCheckName) {
        cy.get(this.newQuickCheckInput).type(quickCheckName);
        cy.get(this.saveBtn).click();
    }

    selectNewSet() {
        cy.get(this.setSelect).select(this.newSetText);
    }

    selectNewSubset() {
        cy.get(this.subsetSelect).select(this.newSubsetText);
    }

    selectSet(setName) {
        cy.get(this.setSelect).select(setName);
    }

    selectSubset(subsetName) {
        cy.get(this.subsetSelect).select(subsetName);
    }
}

export const homePage = new HomePage();