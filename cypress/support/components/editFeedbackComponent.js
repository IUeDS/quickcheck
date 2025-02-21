export class EditFeedbackComponent {
    constructor(questionIndex) {

        //elements
        this.correctFeedback = () => cy.get('.qc-question-panel').eq(questionIndex).find('.qc-custom-feedback-correct textarea');
        this.correctFeedbackContainer = () => cy.get('.qc-question-panel').eq(questionIndex).find('.qc-custom-feedback-correct');
        this.customFeedbackBtn = () => cy.get('.qc-question-panel').eq(questionIndex).find('.qc-btn-add-feedback');
        this.customFeedbackPanel = () => cy.get('.qc-question-panel').eq(questionIndex).find('.qc-custom-feedback-container');
        this.deleteFeedbackBtn = () => cy.get('.qc-question-panel').eq(questionIndex).find('.qc-delete-feedback-btn');
        this.incorrectFeedback = () => cy.get('.qc-question-panel').eq(questionIndex).find('.qc-custom-feedback-incorrect textarea');
        this.questionLevelFeedbackContainer = () => cy.get('.qc-question-panel').eq(questionIndex).find('.qc-custom-feedback-general');
        this.perResponseFeedbackCheckbox = () => cy.get('.qc-question-panel').eq(questionIndex).find('.qc-custom-feedback-response-checkbox input');
        this.perResponseFeedbackOptions = () => this.customFeedbackPanel().findAll('.qc-edit-response-feedback-option');
        this.richContentToggle = () => this.customFeedbackPanel().find('.qc-rich-content-toggle label');

        //strings for sub-elements
        this.perResponseFeedbackCorrectClass = 'qc-custom-feedback-correct';
        this.perResponseFeedbackInput = '.qc-edit-response-feedback';
    }

    addCustomFeedback() {
        this.customFeedbackBtn().click();
    }

    deleteFeedback() {
        this.deleteFeedbackBtn().click();
    }

    enterResponseFeedback(option, text) {
        option.find(this.perResponseFeedbackInput).type(text);
    }

    getCorrectFeedback() {
        return this.correctFeedback();
    }

    getCorrectFeedbackContainer() {
        return this.correctFeedbackContainer();
    }

    getFeedbackByIndex(index) {
        return this.getFeedbackPanel().eq(index);
    }

    getFeedbackPanel() {
        return this.customFeedbackPanel();
    }

    getIncorrectFeedback() {
        return this.incorrectFeedback();
    }

    getPerResponseFeedbackCheckbox() {
        return this.perResponseFeedbackCheckbox();
    }

    getPerResponseFeedbackInput(responseFeedback) {
        return responseFeedback.find('textarea');
    }

    getPerResponseFeedbackOptions() {
        return this.perResponseFeedbackOptions();
    }

    getPerResponseFeedbackText(responseFeedback) {
        return responseFeedback.find(this.perResponseFeedbackInput).invoke('val');
    }

    getQuestionLevelFeedbackContainer() {
        return this.questionLevelFeedbackContainer();
    }

    getRichContentToggle() {
        return this.richContentToggle();
    }

    isFeedbackOptionMarkedCorrect(option) {
        return option.invoke('attr', 'class').then(value => {
            return value.indexOf(this.perResponseFeedbackCorrectClass) > -1;
        });
    }

    togglePerResponseFeedback() {
        this.perResponseFeedbackCheckbox().click();
    }

    toggleRichContent() {
        this.richContentToggle().click();
    }
}