import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';
import { common } from '../../support/common';

describe('Adding a multiple choice question', function () {
    before(() => {
        cy.newLocalAssessment();
    });

    beforeEach(function () {
        const url = data.urls.local.qcEditPage;
        cy.visit(url);
        cy.get('.loader').should('not.be.visible');
        editQcPage.addQuestion();
    });

    it('should accept question text', function () {
        const text = 'What is 2 + 2?';
        common.enterTinyMceText(text, editQcPage.getQuestions().eq(0));
        common.getTinyMceText(editQcPage.getQuestions().eq(0)).should('eq', text);
    });

    it('should default to randomizing answer option order', function () {
        editQcPage.getQuestion(0).getRandomizedCheckbox().should('be.checked');
    });

    it('should allow unchecking the box for randomizing answer option order', function () {
        editQcPage.getQuestion(0).getRandomizedCheckbox().uncheck();
        editQcPage.getQuestion(0).getRandomizedCheckbox().should('not.be.checked');
    });

    it('should throw a validation error if an option does not contain text', function () {
        editQcPage.saveWithoutSuccess();
        editQcPage.getSaveSuccess().should('not.exist');
    });

    it('should throw a validation error if no correct answer is specified when trying to save', function () {
        const text = 'Option text';

        let option = editQcPage.getQuestion(0).getMcOptions().eq(0);
        editQcPage.getQuestion(0).enterMcTextOption(option, text);

        option = editQcPage.getQuestion(0).getMcOptions().eq(1);
        editQcPage.getQuestion(0).enterMcTextOption(option, text);

        option = editQcPage.getQuestion(0).getMcOptions().eq(2);
        editQcPage.getQuestion(0).enterMcTextOption(option, text);

        option = editQcPage.getQuestion(0).getMcOptions().eq(3);
        editQcPage.getQuestion(0).enterMcTextOption(option, text);

        editQcPage.saveWithError();
        editQcPage.getSaveError().should('contain.text', 'correct answer');
    });

    it('should allow an option to be marked as correct', function () {
        editQcPage.getQuestion(0).getMcOptionToggleCorrect(editQcPage.getQuestion(0).getMcOptions().eq(0)).click();
        editQcPage.getQuestion(0).isMcOptionMarkedCorrect(editQcPage.getQuestion(0).getMcOptions().eq(0)).should('be.true');
    });
    
    it('should default to only one answer being allowed as correct', function () {
        editQcPage.getQuestion(0).getMcOptionToggleCorrect(editQcPage.getQuestion(0).getMcOptions().eq(0)).click();
        editQcPage.getQuestion(0).getMcOptionToggleCorrect(editQcPage.getQuestion(0).getMcOptions().eq(1)).click();
    
        editQcPage.getQuestion(0).isMcOptionMarkedCorrect(editQcPage.getQuestion(0).getMcOptions().eq(0)).should('be.false');
        editQcPage.getQuestion(0).isMcOptionMarkedCorrect(editQcPage.getQuestion(0).getMcOptions().eq(1)).should('be.true');
    });

    it('should allow adding a question option', function () {
        editQcPage.getQuestion(0).addMcOption();
        editQcPage.getQuestion(0).getMcOptions().should('have.length', 5);
    });
    
    it('should allow removing a question option', function () {
        editQcPage.getQuestion(0).deleteOption(editQcPage.getQuestion(0).getMcOptions().eq(3));
        editQcPage.getQuestion(0).getMcOptions().should('have.length', 3);
    });

    it('should show an option for per-response feedback', function () {
        editQcPage.getQuestion(0).getFeedback().addCustomFeedback();
        editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackCheckbox().should('be.visible');
    });
    
    it('should hide question-level feedback when per-response feedback is selected', function () {
        editQcPage.getQuestion(0).getFeedback().addCustomFeedback();
        editQcPage.getQuestion(0).getFeedback().togglePerResponseFeedback();
        editQcPage.getQuestion(0).getFeedback().getQuestionLevelFeedbackContainer().should('not.exist');
        editQcPage.getQuestion(0).getFeedback().togglePerResponseFeedback();
        editQcPage.getQuestion(0).getFeedback().getQuestionLevelFeedbackContainer().should('exist');
    });
    
    it('should show each of the options when per-response feedback is added', function () {
        editQcPage.getQuestion(0).getMcOptionToggleCorrect(editQcPage.getQuestion(0).getMcOptions().eq(1)).click();
        editQcPage.getQuestion(0).getFeedback().addCustomFeedback();
        editQcPage.getQuestion(0).getFeedback().togglePerResponseFeedback();
        editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackOptions().should('have.length', 4);
        editQcPage.getQuestion(0).getFeedback().isFeedbackOptionMarkedCorrect(editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackOptions().eq(0)).should('be.false');
        editQcPage.getQuestion(0).getFeedback().isFeedbackOptionMarkedCorrect(editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackOptions().eq(1)).should('be.true');
        editQcPage.getQuestion(0).getFeedback().isFeedbackOptionMarkedCorrect(editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackOptions().eq(2)).should('be.false');
        editQcPage.getQuestion(0).getFeedback().isFeedbackOptionMarkedCorrect(editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackOptions().eq(3)).should('be.false');
    });
});