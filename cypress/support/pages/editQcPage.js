import { EditFeedbackComponent } from '../components/editFeedbackComponent';
import { EditQuestionComponent } from '../components/editQuestionComponent';
import { data } from '../data/data';

export class EditQcPage {
    constructor() {
        this.questions = [];

        //elements
        this.addQuestionBtn = () => cy.get('.qc-btn-add-question');
        this.backBtn = () => cy.contains('a', 'Back');
        this.customActivities = () => cy.get('.qc-edit-custom-activity-option');
        this.customBtn = () => cy.contains('button', 'Make this a custom activity');
        this.customDropdown = () => cy.get('#custom-activity');
        this.customName = () => cy.get('.qc-edit-custom-activity-name');
        this.deleteCustomBtn = () => cy.contains('button', 'Remove custom activity');
        this.descriptionInput = () => cy.get('.qc-edit-description');
        this.goBackToSetLink = () => cy.contains('a', 'Return to set');
        this.nameInput = () => cy.get('.qc-edit-name');
        this.questionsList = () => cy.get('.qc-question-panel');
        this.readOnlyNotice = () => cy.get('.read-only-notice');
        this.saveBtn = () => cy.get('.qc-btn-save-quiz');
        this.saveErrorMsg = () => cy.get('.alert-danger');
        this.saveSuccessMsg = () => cy.get('.alert-success');
        this.subsetInput = () => cy.get('.qc-edit-group');
        this.subsetOptions = () => cy.get('.qc-edit-group option');
        this.titleInput = () => cy.get('.qc-edit-title');
    }

    addQuestion() {
        cy.get('.qc-btn-add-question').should('be.visible').click();
        //cy.get('.qc-btn-add-question').wait(5000).click();
        // cy.get('.qc-btn-add-question').then(($el) => {
        //     $el.on("click", (event) => {
        //       console.log(event);
        //     });
        //   }).click();

        // this.getQuestions().its('length').then(questionCount => {
        //     const newQuestion = this.getQuestions().eq(questionCount - 1);
        //     const questionObject = new EditQuestionComponent(newQuestion, questionType);
        //     if (questionType && questionType !== data.questionTypes.mc) {
        //         questionObject.setQuestionType(questionType);
        //         cy.wait(500); //wait for tinymce to load
        //     }
        //     this.questions.push(questionObject);
        // });
    }

    areInputsDisabled() {
        let inputsDisabled = true;
        cy.get('input').each(input => {
            cy.wrap(input).invoke('attr', 'disabled').then(disabled => {
                if (!disabled) {
                    inputsDisabled = false;
                }
            });
        });
        return inputsDisabled;
    }

    deleteCustom() {
        this.deleteCustomBtn().click();
    }

    getAssessmentName() {
        return this.nameInput().invoke('val');
    }

    getCurrentSubset() {
        return this.subsetInput().find('option:checked').invoke('text');
    }

    getCustomActivities() {
        return this.customActivities();
    }

    getCustomBtn() {
        return this.customBtn();
    }

    getCustomDeleteBtn() {
        return this.deleteCustomBtn();
    }

    getCustomDropdown() {
        return this.customDropdown();
    }

    getCustomName() {
        return this.customName().invoke('text');
    }

    getDescriptionInput() {
        return this.descriptionInput();
    }

    getFeedback(index) {
        return new EditFeedbackComponent(index);
    }

    getNameInput() {
        return this.nameInput();
    }

    getQuestion(index) {
        return new EditQuestionComponent(this.getQuestions().eq(index), index);
    }

    getQuestions() {
        return this.questionsList();
    }

    getSaveBtn() {
        return this.saveBtn();
    }

    getSaveError() {
        return this.saveErrorMsg();
    }

    getSaveSuccess() {
        return this.saveSuccessMsg();
    }

    getSubsetOptions() {
        return this.subsetOptions();
    }

    getSubsetSelect() {
        return this.subsetInput();
    }

    getTitleInput() {
        return this.titleInput();
    }

    goBack() {
        this.backBtn().click();
    }

    goBackToSet() {
        this.waitForSaveSuccess();
        this.goBackToSetLink().click();
    }

    initQuestions() {
        this.questions = []; //clear if any were previously saved
        this.getQuestions().each((question, index) => {
            const questionElement = this.getQuestions().eq(index);
            const questionObject = new this.includes.EditQuestionComponent(questionElement);
            questionObject.getQuestionType().then(questionType => {
                questionObject.composeQuestionType(questionType);
                this.questions.push(questionObject);
            });
        });
    }

    isReadOnly() {
        return this.readOnlyNotice().should('exist');
    }

    save() {
        this.saveBtn().click();
        cy.wait('@saveRequest'); // Assuming you have an alias for the save request
        this.getSaveSuccess().should('exist').then(saveSuccess => {
            if (!saveSuccess) {
                this.saveBtn().click();
                cy.wait('@saveRequest');
            }
        });
    }

    saveWithError() {
        this.saveBtn().click();
        cy.wait('@saveRequest'); // Assuming you have an alias for the save request
        this.waitForSaveFailure();
    }

    saveWithoutSuccess() {
        this.saveBtn().click();
        cy.wait('@saveRequest'); // Assuming you have an alias for the save request
    }

    waitForSaveFailure() {
        this.saveErrorMsg().should('be.visible');
    }

    waitForSaveSuccess() {
        this.goBackToSetLink().should('be.visible');
    }
}

export const editQcPage = new EditQcPage();