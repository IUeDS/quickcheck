import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';

describe('Adding a numerical question', function() {    
        before(() => {
            cy.newLocalAssessment();
        });
    
        beforeEach(function () {
            const url = data.urls.local.qcEditPage;
            cy.visit(url);
            cy.get('.loader').should('not.be.visible');
            editQcPage.addQuestion();
            editQcPage.getQuestion(0).setQuestionType(data.questionTypes.numerical);
        });

    it('should not feature a randomize options checkbox', function() {
        editQcPage.getQuestion(0).getRandomizedCheckbox().should('not.exist');
    });

    it('should allow adding a possible answer', function() {
        editQcPage.getQuestion(0).addNumericalAnswer();
        editQcPage.getQuestion(0).getNumericalOptions().should('have.length', 1);
    });

    it('should throw a validation error if the numeric answer field isn\'t filled', function() {
        editQcPage.getQuestion(0).addNumericalAnswer();
        editQcPage.saveWithoutSuccess();
        editQcPage.getSaveSuccess().should('not.exist');
    });

    it('should show exact answer and margin of error as the default', function() {
        editQcPage.getQuestion(0).addNumericalAnswer();
        editQcPage.getQuestion(0).getNumericalOptions().eq(0).within(() => {
            cy.get('.qc-edit-numerical-answer').should('be.visible');
            cy.get('.qc-edit-numerical-margin').should('be.visible');
            cy.get('.qc-edit-numerical-range-min').should('not.exist');
            cy.get('.qc-edit-numerical-range-max').should('not.exist');
        });
    });

    it('should show the range options when answer type is changed', function() {
        editQcPage.getQuestion(0).addNumericalAnswer();
        editQcPage.getQuestion(0).getNumericalOptions().eq(0).within(() => {
            cy.get('.qc-edit-numerical-answer-type').select('Answer in the range');
            cy.get('.qc-edit-numerical-answer').should('not.exist');
            cy.get('.qc-edit-numerical-margin').should('not.exist');
            cy.get('.qc-edit-numerical-range-min').should('be.visible');
            cy.get('.qc-edit-numerical-range-max').should('be.visible');
        });
    });

    it('should allow deleting a possible answer', function() {
        editQcPage.getQuestion(0).addNumericalAnswer();
        editQcPage.getQuestion(0).deleteOption(editQcPage.getQuestion(0).getNumericalOptions().eq(0));
        editQcPage.getQuestion(0).getNumericalOptions().should('have.length', 0);
    });

    it('should accept an exact numerical answer', function() {
        editQcPage.getQuestion(0).addNumericalAnswer();
        editQcPage.getQuestion(0).getNumericalOptions().eq(0).within(() => {
            cy.get('.qc-edit-numerical-answer').type(data.quizData.quiz1.question7.option1);
            cy.get('.qc-edit-numerical-margin').type('0');
        });
    });

    it('should not show an option for per-response feedback', function() {
        const feedback = editQcPage.getFeedback(0);
        feedback.addCustomFeedback();
        feedback.getPerResponseFeedbackCheckbox().should('not.exist');
        feedback.deleteFeedback();
    });
});