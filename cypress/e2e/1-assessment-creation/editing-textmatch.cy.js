import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';

describe('Adding a textmatch question', function() {
    const questionData = data.quizData.quiz1.question3;

    before(() => {
        cy.newLocalAssessment();
    });

    beforeEach(function () {
        const url = data.urls.local.qcEditPage;
        cy.visit(url);
        cy.get('.loader').should('not.be.visible');
        editQcPage.addQuestion();
        editQcPage.getQuestion(0).setQuestionType(data.questionTypes.textmatch);
    });

    it('should not feature a randomize options checkbox', function() {
        editQcPage.getQuestion(0).getRandomizedCheckbox().should('not.exist');
    });

    it('should allow adding a possible answer', function() {
        editQcPage.getQuestion(0).addTextmatchAnswer();
        editQcPage.getQuestion(0).getTextMatchOptions().should('have.length', 1);
    });

    it('should throw a validation error if the textmatch answer field isn\'t filled', function() {
        editQcPage.getQuestion(0).addTextmatchAnswer();
        editQcPage.saveWithoutSuccess();
        editQcPage.getSaveSuccess().should('not.exist');
    });

    it('should allow deleting a possible answer', function() {
        editQcPage.getQuestion(0).addTextmatchAnswer();
        editQcPage.getQuestion(0).addTextmatchAnswer();
        editQcPage.getQuestion(0).deleteOption(editQcPage.getQuestion(0).getTextMatchOptions().eq(1));
        editQcPage.getQuestion(0).getTextMatchOptions().should('have.length', 1);
    });

    it('should not show an option for per-response feedback', function() {
        const feedback = editQcPage.getFeedback(0);
        feedback.addCustomFeedback();
        feedback.getPerResponseFeedbackCheckbox().should('not.exist');
    });
});