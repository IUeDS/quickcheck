import data from '../data/data';   
import { EditFeedbackComponent } from './editFeedbackComponent';

export class EditQuestionComponent {
    constructor(question, questionType) {
        this.questionTypes = data.questionTypes;
        this.questionType = questionType;

        //default to first question; can be set manually as well
        if (question) {
            this.question = question;
        } else {
            this.question = cy.get('.qc-question-panel').first();
        }

        //sub-components
        this.feedback = new EditFeedbackComponent(question);

        //elements
        this.addMcOptionBtn = () => this.question.findByText('Add option');
        this.deleteBtn = () => this.question.find('.qc-delete-question-btn');
        this.headerText = () => this.question.find('.qc-question-header-number');
        this.options = () => this.question.find('.qc-edit-option');
        this.questionTypeDropdown = () => this.question.find('.qc-edit-question-type');
        this.randomizedCheckbox = () => this.question.find('.qc-randomize-checkbox');
        this.reorderDownBtn = () => this.question.find('.qc-reorder-down-btn');
        this.reorderUpBtn = () => this.question.find('.qc-reorder-up-btn');
        this.richContentToggle = () => this.question.find('.qc-rich-content-toggle label');

        //string references (for sub-elements)
        this.deleteOptionBtn = '.qc-delete-option-btn-inline';
        this.inputElement = 'input[type="text"]';
        this.mcIsCorrectClass = '.qc-selected-correct';
        this.mcMarkCorrectClass = '.qc-correct-symbol';
    }

    addMcOption() {
        this.addMcOptionBtn().click();
    }

    deleteOption(option) {
        option.find(this.deleteOptionBtn).click();
    }

    deleteQuestion() {
        this.deleteBtn().click();
    }

    enterMcTextOption(option, text) {
        option.find(this.inputElement).type(text);
    }

    getDeleteBtn() {
        return this.deleteBtn();
    }

    getDeleteOptionBtns() {
        return cy.get(this.deleteOptionBtn);
    }

    getHeaderText() {
        return this.headerText().invoke('text').then(text => text.toLowerCase());
    }

    getMcOptionInputValue(option) {
        return option.find(this.inputElement).invoke('val');
    }

    getMcOptionInput(option) {
        return option.find(this.inputElement);
    }

    getMcOptionToggleCorrect(option) {
        return option.find(this.mcMarkCorrectClass);
    }

    getOptions() {
        return this.options();
    }

    getQuestionTypeDropdown() {
        return this.questionTypeDropdown();
    }

    getQuestionType() {
        return this.questionTypeDropdown().find('option:checked').invoke('text');
    }

    getRandomizedCheckbox() {
        return this.randomizedCheckbox();
    }

    getReorderDownBtn() {
        return this.reorderDownBtn();
    }

    getReorderUpBtn() {
        return this.reorderUpBtn();
    }

    getRichContentToggle() {
        return this.richContentToggle();
    }

    isMcOptionMarkedCorrect(option) {
        return option.find(this.mcIsCorrectClass).should('exist');
    }

    isRandomized() {
        return this.randomizedCheckbox().invoke('attr', 'checked');
    }

    setCurrentQuestion(question) {
        this.question = question;
    }

    setQuestionType(questionType) {
        this.questionTypeDropdown().find(`option:contains(${questionType})`).click();
    }

    toggleMcOptionCorrect(option) {
        option.find(this.mcMarkCorrectClass).click();
    }

    toggleRandomized() {
        this.randomizedCheckbox().click();
    }

    toggleRichContent() {
        this.richContentToggle().click();
    }
}