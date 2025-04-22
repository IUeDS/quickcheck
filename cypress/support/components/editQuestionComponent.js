import data from '../data/data';   
import { EditFeedbackComponent } from './editFeedbackComponent';

export class EditQuestionComponent {
    constructor(question, questionIndex = 0) {
        this.questionTypes = data.questionTypes;
        this.questionIndex = questionIndex;

        //default to first question; can be set manually as well
        if (question) {
            this.question = question;
        } else {
            this.question = cy.get('.qc-question-panel').first();
        }

        //sub-components
        this.feedback = new EditFeedbackComponent(this.questionIndex);

        //elements
        this.addMcOptionBtn = () => this.question.contains('Add option');
        this.deleteBtn = () => this.question.find('.qc-delete-question-btn');
        this.headerText = () => this.question.find('.qc-question-header-number');
        this.mcOptions = () => this.question.find('.qc-edit-option');
        this.mCorrectOptions = () => this.question.find('.qc-edit-option');
        this.questionTypeDropdown = () => this.question.find('.qc-edit-question-type');
        this.randomizedCheckbox = () => this.question.find('.qc-randomize-checkbox');
        this.reorderDownBtn = () => this.question.find('.qc-reorder-down-btn');
        this.reorderUpBtn = () => this.question.find('.qc-reorder-up-btn');
        this.richContentToggle = () => this.question.find('.qc-rich-content-toggle label');

        //matrix elements
        this.matrixAddColumnBtn = () => this.question.find('button').contains('Add column');
        this.matrixAddRowBtn = () => this.question.find('button').contains('Add row');
        this.matrixCheckboxes = () => this.question.find('table input[type="radio"]');
        this.matrixColumns = () => this.question.find('.qc-edit-matrix-column');
        this.matrixRows = () => this.question.find('.qc-edit-matrix-row');
        this.matrixTextInputs = () => this.question.find('table input[type="text"]');

        //matching elements
        this.addDistractorBtn = () => this.question.find('button').contains('Add distractor');
        this.addMatchingPairBtn = () => this.question.find('button').contains('Add matching pair');
        this.matchingDistractors = () => this.question.find('.qc-edit-matching-distractor');
        this.matchingPairInputs = () => this.question.find('table input[type="text"]');
        this.matchingPrompts = () => this.question.find('.qc-edit-matching-prompt');
        this.distractorInputElement = 'input[type="text"]';

        //dropdowns
        this.addDropdownPairBtn = () => this.question.find('button').contains('Add dropdown pair');
        this.dropdownDistractors = () => this.question.find('.qc-edit-dropdown-distractor');
        this.dropdownPrompts = () => this.question.find('.qc-edit-dropdown-prompt');
        this.dropdownTextInputs = () => this.question.find('table input[type="text"]');

        //textmatch
        this.addTextmatchAnswerBtn = () => this.question.find('button').contains('Add possible answer');
        this.textMatchOptions = () => this.question.find('.qc-edit-option');

        //numerical
        this.addNumericalAnswerBtn = () => this.question.find('button').contains('Add possible answer');
        this.numericalOptions = () => this.question.find('.qc-edit-option');
        this.answerTypeElement = '.qc-edit-numerical-answer-type';
        this.exactAnswerElement = '.qc-edit-numerical-answer';
        this.marginOfErrorElement = '.qc-edit-numerical-margin';
        this.rangeMinElement = '.qc-edit-numerical-range-min';
        this.rangeMaxElement = '.qc-edit-numerical-range-max';

        //string references (for sub-elements)
        this.deleteOptionBtn = '.qc-delete-option-btn-inline';
        this.inputElement = 'input[type="text"]';
        this.mcMarkCorrectClass = '.qc-mc-correct-wrapper input';
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

    getFeedback() {
        return this.feedback;
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

    getMCorrectOptionInput(option) {
        return option.find(this.inputElement);
    }

    getMCorrectOptionInputValue(option) {
        return option.find(this.inputElement).invoke('val');
    }

    getMcOptionToggleCorrect(option) {
        return option.find(this.mcMarkCorrectClass);
    }

    getMcOptions() {
        return this.mcOptions();
    }

    getMCorrectOptions() {
        return this.mCorrectOptions();
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
        return option.find(this.mcMarkCorrectClass).invoke('prop', 'checked');
    }

    isRandomized() {
        return this.randomizedCheckbox().invoke('prop', 'checked');
    }

    setCurrentQuestion(question) {
        this.question = question;
    }

    setQuestionType(questionType) {
        this.questionTypeDropdown().select(questionType);
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

    //matrix functions 
    addMatrixColumn() {
        this.matrixAddColumnBtn().click();
    }

    addMatrixRow() {
        this.matrixAddRowBtn().click();
    }

    getMatrixCheckboxes() {
        return this.matrixCheckboxes();
    }

    getMatrixColumns() {
        return this.matrixColumns();
    }

    getMatrixRows() {
        return this.matrixRows();
    }

    getMatrixTextInputs() {
        return this.matrixTextInputs();
    }

    //matching functions
    addDistractor() {
        this.addDistractorBtn().click();
    }

    addMatchingPair() {
        this.addMatchingPairBtn().click();
    }

    enterDistractor(distractor, text) {
        distractor.find(this.distractorInputElement).type(text);
    }

    getMatchingDistractors() {
        return this.matchingDistractors();
    }

    getDistractorInput(distractor) {
        return distractor.find(this.distractorInputElement);
    }

    getMatchingPairInputs() {
        return this.matchingPairInputs();
    }

    getMatchingPrompts() {
        return this.matchingPrompts();
    }

    //drodown functions
    addDropdownPair() {
        this.addDropdownPairBtn().click();
    }

    getDropdownDistractors() {
        return this.dropdownDistractors();
    }

    getDropdownPrompts() {
        return this.dropdownPrompts();
    }

    getDropdownTextInputs() {
        return this.dropdownTextInputs();
    }

    //textmatch functions
    addTextmatchAnswer() {
        this.addTextmatchAnswerBtn().click();
    }

    enterTextMatchOption(option, text) {
        option.find(this.inputElement).type(text);
    }

    getOptionInput(option) {
        return option.find(this.inputElement);
    }

    getTextMatchOptions() {
        return this.textMatchOptions();
    }

    //numerical functions

    addNumericalAnswer() {
        this.addNumericalAnswerBtn().click();
    }

    enterNumericalExactOption(option, answer, marginOfError) {
        option.find(this.exactAnswerElement).type(answer);
        option.find(this.marginOfErrorElement).type(marginOfError);
    }

    enterNumericalRangeOption(option, rangeMin, rangeMax) {
        option.find(this.rangeMinElement).type(rangeMin);
        option.find(this.rangeMaxElement).type(rangeMax);
    }

    getExactAnswerInput(option) {
        return option.find(this.exactAnswerElement);
    }

    getMarginOfErrorInput(option) {
        return option.find(this.marginOfErrorElement);
    }

    getNumericalOptions() {
        return this.numericalOptions();
    }

    getRangeMinInput(option) {
        return option.find(this.rangeMinElement);
    }

    getRangeMaxInput(option) {
        return option.find(this.rangeMaxElement);
    }

    setOptionAsExactAnswer(option) {
        option.find(this.answerTypeElement).select('Exact');
    }

    setOptionAsRange(option) {
        option.find(this.answerTypeElement).select('Answer in the range');
    }
}