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
        this.deleteBtn = () => this.question.find('.qc-delete-question-btn');
        this.headerText = () => this.question.find('.qc-question-header-number');
        this.options = () => this.question.findAll('.qc-edit-option');
        this.questionTypeDropdown = () => this.question.find('.qc-edit-question-type');
        this.randomizedCheckbox = () => this.question.find('.qc-randomize-checkbox');
        this.reorderDownBtn = () => this.question.find('.qc-reorder-down-btn');
        this.reorderUpBtn = () => this.question.find('.qc-reorder-up-btn');
        this.richContentToggle = () => this.question.find('.qc-rich-content-toggle label');

        //string references (for sub-elements)
        this.deleteOptionBtn = '.qc-delete-option-btn-inline';

        //functions
        this.composeQuestionType();
    }

    composeQuestionType(newQuestionType) {
        let questionType = this.questionType;
        let questionTypeComponent;

        if (!this.questionType && !newQuestionType) {
            return;
        }
        if (newQuestionType) {
            questionType = newQuestionType;
        }

        switch(questionType) {
            case this.questionTypes.mc:
            case this.questionTypes.mcorrect:
                questionTypeComponent = new this.includes.QuestionTypeMcComponent(this.question);
                break;
            case this.questionTypes.matrix:
                questionTypeComponent = new this.includes.QuestionTypeMatrixComponent(this.question);
                break;
            case this.questionTypes.matching:
                questionTypeComponent = new this.includes.QuestionTypeMatchingComponent(this.question);
                break;
            case this.questionTypes.dropdowns:
                questionTypeComponent = new this.includes.QuestionTypeDropdownsComponent(this.question);
                break;
            case this.questionTypes.numerical:
                questionTypeComponent = new this.includes.QuestionTypeNumericalComponent(this.question);
                break;
            case this.questionTypes.textmatch:
                questionTypeComponent = new this.includes.QuestionTypeTextmatchComponent(this.question);
                break;
        }
        Object.assign(this, questionTypeComponent);
    }

    deleteOption(option) {
        option.find(this.deleteOptionBtn).click();
    }

    deleteQuestion() {
        this.deleteBtn().click();
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

    isRandomized() {
        return this.randomizedCheckbox().invoke('attr', 'checked');
    }

    setCurrentQuestion(question) {
        this.question = question;
    }

    setQuestionType(questionType) {
        this.questionTypeDropdown().find(`option:contains(${questionType})`).click();
    }

    toggleRandomized() {
        this.randomizedCheckbox().click();
    }

    toggleRichContent() {
        this.richContentToggle().click();
    }
}