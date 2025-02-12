export class SubsetPanelComponent {
    constructor(subsetElement) {
        this.subsetElement = null;
        if (subsetElement) {
            this.subsetElement = subsetElement;
        }

        //elements
        this.addQcBtn = () => this.subset.find('.qc-btn-add-quiz');
        this.deleteSubsetBtn = () => this.subset.find('.qc-subset-delete-btn');
        this.editSubsetBtn = () => this.subset.find('.qc-subset-edit-btn');
        this.editSubsetInput = () => this.subset.find('.qc-edit-subset-input');
        this.header = () => this.subset.find('.qc-assessment-group-title');
        this.name = () => this.subset.find('h3');
        this.newQcInput = () => this.subset.find('input');
        this.quickChecks = () => this.subset.find('.qc-quiz-row');
        this.saveQcBtn = () => this.subset.find('.btn-success');
        this.subsetInstructions = () => this.subset.find('p');

        //selectors (for sub-components)
        this.copyQcBtn = '.qc-quiz-copy-btn';
        this.copyQcEditBtn = '.qc-quiz-copy-edit-btn';
        this.copyQcName = '.qc-copy-quiz-name';
        this.copyQcPanel = '.qc-quiz-copy-panel';
        this.copyQcSetSelect = '.qc-copy-quiz-collection';
        this.copyQcSubmitBtn = '.qc-copy-quiz-submit';
        this.copyQcSubsetSelect = '.qc-copy-quiz-assessment-group';
        this.deleteQcBtn = '.qc-quiz-delete-btn';
        this.editQcBtn = '.qc-quiz-edit-btn';
        this.previewQcBtn = '.qc-quiz-preview-btn';
    }

    get subset() {
        if (this.subsetElement) {
            return this.subsetElement;
        }

        return cy.get('.qc-subset-panel').first();
    }

    addQuickCheck() {
        this.addQcBtn().click();
    }

    addAndSaveQuickCheck(quickcheckName) {
        this.addQcBtn().click();
        this.getNewQcInput().should('be.visible').type(quickcheckName);
        this.saveQuickCheck();
    }

    areSubsetInstructionsVisible() {
        return this.subsetInstructions().should('be.visible');
    }

    copyQuickCheck(quickcheck) {
        quickcheck.find(this.copyQcBtn).click();
    }

    deleteQuickCheck(quickCheck) {
        quickCheck.find(this.deleteQcBtn).click();
    }

    deleteSubset() {
        this.deleteSubsetBtn().click();
    }

    editQuickCheck(quickCheck) {
        quickCheck.find(this.editQcBtn).click();
    }

    editSubset() {
        this.editSubsetBtn().click();
    }

    getAddQcBtn() {
        return this.addQcBtn();
    }

    getCopyEditBtn(quickcheck) {
        return quickcheck.find(this.copyQcEditBtn);
    }

    getCopyPanel(quickcheck) {
        return quickcheck.find(this.copyQcPanel);
    }

    getCopyQuickCheckName(quickcheck) {
        return quickcheck.find(this.copyQcName).invoke('val');
    }

    getCopySelectSetDropdownOptions(quickcheck) {
        return quickcheck.find(this.copyQcSetSelect).findAll('option');
    }

    getCopySelectSetDropdownValue(quickcheck) {
        return quickcheck.find(this.copyQcSetSelect).find('option:checked').invoke('text');
    }

    getCopySelectSubsetDropdownOptions(quickcheck) {
        return quickcheck.find(this.copyQcSubsetSelect).findAll('option');
    }

    getCopySelectSubsetDropdownValue(quickcheck) {
        return quickcheck.find(this.copyQcSubsetSelect).find('option:checked').invoke('text');
    }

    getDeleteQcBtn(quickcheck) {
        return quickcheck.find(this.deleteQcBtn);
    }

    getDeleteSubsetBtn() {
        return this.deleteSubsetBtn();
    }

    getEditSubsetBtn() {
        return this.editSubsetBtn();
    }

    getEditSubsetInput() {
        return this.editSubsetInput();
    }

    getName() {
        return this.name().invoke('text');
    }

    getNewQcInput() {
        return this.newQcInput();
    }

    getQuickChecks() {
        return this.quickChecks();
    }

    previewQuickCheck(quickCheck) {
        quickCheck.find(this.previewQcBtn).click();
    }

    saveQuickCheck() {
        this.saveQcBtn().click();
    }

    setSubset(subset) {
        this.subset = subset;
    }

    submitCopy(quickcheck) {
        quickcheck.find(this.copyQcSubmitBtn).click();
    }

    submitEditedSubset(name) {
        const input = this.getEditSubsetInput();
        input.type(name);
        input.type('{enter}');
    }

    toggleAccordion() {
        this.header().click();
        cy.wait(1000); //wait for animation to finish
    }
}