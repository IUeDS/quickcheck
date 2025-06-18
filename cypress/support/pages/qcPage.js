export class QcPage {
    constructor() {
        // Elements
        this.continueBtn = () => cy.get('.qc-continue-btn');
        this.description = () => cy.get('.qc-assessment-description');
        this.dropdownPrompts = () => cy.get('label');
        this.finalScore = () => cy.get('.qc-final-score');
        this.finishedMessage = () => cy.get('.qc-finished-msg');
        this.finishedGradedMessage = () => cy.get('.qc-graded-msg');
        this.finishedGradePendingMessage = () => cy.get('.qc-grade-pending-msg');
        this.finishedUngradedMessage = () => cy.get('.qc-ungraded-msg');
        this.incorrectRows = () => cy.get('tr.table-danger');
        this.matchingPrompts = () => cy.get('table tr td:first-of-type');
        this.mcOptions = () => cy.get('.qc-assessment-multiple-choice-option');
        this.mCorrectOptions = () => cy.get('.qc-assessment-multiple-correct-option');
        this.matrixCheckboxes = () => cy.get('table input');
        this.matrixColumnCells = () => cy.get('table th');
        this.matrixRowCells = () => cy.get('table tr td:first-of-type');
        this.modalCompletion = () => cy.get('#qc-completion-modal');
        this.modalFeedback = () => cy.get('#qc-feedback-modal');
        this.modalFeedbackHeader = () => this.modalFeedback().find('h2');
        this.moduleMessage = () => cy.get('.qc-module-msg');
        this.numericalInput = () => cy.get('input[type="number"]');
        this.perResponseFeedback = () => cy.get('.custom-feedback');
        this.questionProgress = () => cy.get('.qc-question-number');
        this.questionText = () => cy.get('.qc-assessment-question');
        this.restartBtn = () => cy.get('.qc-btn-restart-assessment');
        this.rowFeedback = () => cy.get('.qc-row-feedback');
        this.rowFeedbackContinueBtn = () => this.rowFeedback().contains('Click to continue');
        this.selectables = () => cy.get('.qc-selectable-answer-option');
        this.selects = () => cy.get('select');
        this.score = () => cy.get('.qc-current-score');
        this.startOverBtn = () => cy.get('.qc-restart');
        this.submitBtn = () => cy.get('.qc-submit-response');
        this.textmatchInput = () => cy.get('input[type="text"]');
        this.timeoutModal = () => cy.get('#qc-assessment-timeout-modal');
        this.timeoutRestartBtn = () => cy.get('#qc-assessment-timeout-modal .qc-btn-restart-assessment');
        this.timeoutTimer = () => cy.get('.qc-timeout-timer');
        this.title = () => cy.get('.qc-assessment-title');
    }

    // Functions
    clickContinue() {
        this.continueBtn().click();
    }

    clickRowContinue() {
        this.rowFeedbackContinueBtn().click();
    }

    enterNumericalAnswer(answer) {
        this.numericalInput().type(answer);
    }

    enterTextmatchAnswer(answer) {
        this.textmatchInput().type(answer);
    }

    getDescription() {
        return this.description();
    }

    getDropdownPrompts() {
        return this.dropdownPrompts();
    }

    getFinalScore() {
        return this.finalScore().invoke('text').then((text) => text.toLowerCase());
    }

    getIncorrectRows() {
        return this.incorrectRows();
    }

    getMatchingPrompts() {
        return this.matchingPrompts();
    }

    getMatrixCheckboxes() {
        return this.matrixCheckboxes();
    }

    getMatrixColumnCells() {
        return this.matrixColumnCells();
    }

    getMatrixRowCells() {
        return this.matrixRowCells();
    }

    getMcOptions() {
        return this.mcOptions();
    }

    getMCorrectOptions() {
        return this.mCorrectOptions();
    }

    getNumericalInput() {
        return this.numericalInput();
    }

    getPerResponseFeedback() {
        return this.perResponseFeedback();
    }

    getQuestionProgress() {
        return this.questionProgress().invoke('text').then((text) => text.toLowerCase());
    }

    getQuestionText() {
        return this.questionText().invoke('text');
    }

    getRowFeedback() {
        return this.rowFeedback();
    }

    getSelectables() {
        return this.selectables();
    }

    getSelects() {
        return this.selects();
    }

    getScore() {
        return this.score().invoke('text').then((text) => text.toLowerCase());
    }

    getTextmatchInput() {
        return this.textmatchInput();
    }

    getTimeoutModal() {
        return this.timeoutModal();
    }

    getTimeoutRestartBtn() {
        return this.timeoutRestartBtn();
    }

    getTimeoutTimer() {
        return this.timeoutTimer();
    }

    getTitle() {
        return this.title();
    }

    isCompletionModalVisible() {
        this.modalCompletion().should('be.visible');
    }

    isCorrectModal() {
        this.modalFeedback().should('be.visible');
        this.modalFeedbackHeader().invoke('text').then((text) => {
            return text.includes('Correct');
        });
    }

    isIncorrectModal() {
        this.modalFeedback().should('be.visible');
        this.modalFeedbackHeader().invoke('text').then((text) => {
            return text.includes('Incorrect');
        });
    }

    isCorrectRowFeedback() {
        this.rowFeedback().invoke('text').then((text) => {
            return text.includes('Correct');
        });
    }

    isIncorrectRowFeedback() {
        this.rowFeedback().invoke('text').then((text) => {
            return text.includes('Incorrect');
        });
    }

    isModuleMessagePresent() {
        this.moduleMessage().should('exist');
    }

    isQcFinished() {
        this.finishedMessage().should('be.visible');
    }

    isQcGraded() {
        this.modalCompletion().should('be.visible');
        this.finishedGradedMessage().should('be.visible');
    }

    isQcPendingGrade() {
        this.modalCompletion().should('be.visible');
        this.finishedGradePendingMessage().should('be.visible');
    }

    isQcUngraded() {
        this.modalCompletion().should('be.visible');
        this.finishedUngradedMessage().should('be.visible');
    }

    isSelectablePicked(index) {
        this.selectables().eq(index).should('have.class', 'badge-secondary');
    }

    isSubmitBtnDisabled() {
        this.submitBtn().should('be.disabled');
    }

    restart() {
        this.restartBtn().click();
    }

    selectIncorrectRandomMcOption(correctOption) {
        this.getMcOptions().each(($option) => {
            cy.wrap($option).invoke('text').then((text) => {
                if (text !== correctOption) {
                    cy.wrap($option).find('input').click();
                }
            });
        });
    }

    selectMatrixCheckboxByIndex(index) {
        this.getMatrixCheckboxes().eq(index).click();
    }

    selectMcOptionByIndex(index) {
        this.getMcOptions().eq(index).find('input').click();
    }

    selectMCorrectOptionByIndex(index) {
        this.getMCorrectOptions().eq(index).find('input').click();
    }

    selectOption(selectIndex, text) {
        this.getSelects().eq(selectIndex).select(text);
    }

    startOver() {
        this.startOverBtn().click();
    }

    submit() {
        this.submitBtn().click();
    }
}

export const qcPage = new QcPage();