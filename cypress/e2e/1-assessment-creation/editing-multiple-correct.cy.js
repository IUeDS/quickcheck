import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';
import { common } from '../../support/common';

describe('Adding a multiple correct question', function () {
    before(() => {
        cy.newLocalAssessment();
    });

    beforeEach(function () {
        const url = data.urls.local.qcEditPage;
        cy.visit(url);
        cy.get('.loader').should('not.be.visible');
        editQcPage.addQuestion();
        editQcPage.getQuestion(0).setQuestionType(data.questionTypes.mcorrect);
    });

    it('should default to randomizing answer option order', function () {
        editQcPage.getQuestion(0).getRandomizedCheckbox().should('be.checked');
    });

    it('should allow adding a question option', function () {
        editQcPage.getQuestion(0).addMcOption();
        editQcPage.getQuestion(0).getMcOptions().should('have.length', 5);
    });

    it('should allow removing a question option', function () {
        editQcPage.getQuestion(0).deleteOption(editQcPage.getQuestion(0).getMcOptions().eq(0));
        editQcPage.getQuestion(0).getMcOptions().should('have.length', 3);
    });

    it('should throw a validation error if an option does not contain text', function () {
        editQcPage.saveWithoutSuccess();
        editQcPage.getSaveSuccess().should('not.exist');
    });

    it('should throw a validation error if no correct answer is specified when trying to save', function () {
        editQcPage.getQuestion(0).enterMcTextOption(editQcPage.getQuestion(0).getMcOptions().eq(0), 'test 1');
        editQcPage.getQuestion(0).enterMcTextOption(editQcPage.getQuestion(0).getMcOptions().eq(1), 'test 2');
        editQcPage.getQuestion(0).enterMcTextOption(editQcPage.getQuestion(0).getMcOptions().eq(2), 'test 3');
        editQcPage.getQuestion(0).enterMcTextOption(editQcPage.getQuestion(0).getMcOptions().eq(3), 'test 4');
        editQcPage.saveWithError();
        editQcPage.getSaveError().should('contain.text', data.validateNoCorrectMessage);
    });

    it('should allow marking multiple options as correct', function () {
        editQcPage.getQuestion(0).getMcOptionToggleCorrect(editQcPage.getQuestion(0).getMcOptions().eq(0)).click();
        editQcPage.getQuestion(0).getMcOptionToggleCorrect(editQcPage.getQuestion(0).getMcOptions().eq(1)).click();
        editQcPage.getQuestion(0).isMcOptionMarkedCorrect(editQcPage.getQuestion(0).getMcOptions().eq(0)).should('be.true');
        editQcPage.getQuestion(0).isMcOptionMarkedCorrect(editQcPage.getQuestion(0).getMcOptions().eq(1)).should('be.true');
    });

    it('should allow toggling a correct answer to incorrect', function () {
        editQcPage.getQuestion(0).getMcOptionToggleCorrect(editQcPage.getQuestion(0).getMcOptions().eq(1)).click();
        editQcPage.getQuestion(0).getMcOptionToggleCorrect(editQcPage.getQuestion(0).getMcOptions().eq(1)).click();
        editQcPage.getQuestion(0).isMcOptionMarkedCorrect(editQcPage.getQuestion(0).getMcOptions().eq(1)).should('be.false');
    });

    it('should show an option for per-response feedback', function () {
        editQcPage.getQuestion(0).getFeedback().addCustomFeedback();
        editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackCheckbox().should('be.visible');
    });

    it('should show each of the options when per-response feedback is added', function () {
        editQcPage.getQuestion(0).getMcOptionToggleCorrect(editQcPage.getQuestion(0).getMcOptions().eq(0)).click();
        editQcPage.getQuestion(0).getMcOptionToggleCorrect(editQcPage.getQuestion(0).getMcOptions().eq(1)).click();
        editQcPage.getQuestion(0).getFeedback().addCustomFeedback();
        editQcPage.getQuestion(0).getFeedback().togglePerResponseFeedback();
        editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackOptions().should('have.length', 4);
        editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackOptions().eq(0).should('have.class', 'qc-custom-feedback-correct');
        editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackOptions().eq(1).should('have.class', 'qc-custom-feedback-correct');
        editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackOptions().eq(2).should('not.have.class', 'qc-custom-feedback-correct');
        editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackOptions().eq(3).should('not.have.class', 'qc-custom-feedback-correct');
    });
});