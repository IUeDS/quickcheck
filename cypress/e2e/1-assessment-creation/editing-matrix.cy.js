import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';

describe('Adding a matrix question', function() {
    const questionData = data.quizData.quiz1.question3;

    before(() => {
        cy.newLocalAssessment();
    });

    beforeEach(function () {
        const url = data.urls.local.qcEditPage;
        cy.visit(url);
        cy.get('.loader').should('not.be.visible');
        editQcPage.addQuestion();
        editQcPage.getQuestion(0).setQuestionType(data.questionTypes.matrix);
        editQcPage.getQuestion(0).addMatrixColumn();
        editQcPage.getQuestion(0).addMatrixColumn();
        editQcPage.getQuestion(0).addMatrixRow();
        editQcPage.getQuestion(0).addMatrixRow();
    });

    it('should default to randomizing answer option order', function() {
        editQcPage.getQuestion(0).getRandomizedCheckbox().should('be.checked');
    });

    it('should allow adding columns', function() {
        editQcPage.getQuestion(0).getMatrixColumns().should('have.length', 2);
    });

    it('should allow deleting columns', function() {
        editQcPage.getQuestion(0).deleteOption(editQcPage.getQuestion(0).getMatrixColumns().eq(1));
        editQcPage.getQuestion(0).getMatrixColumns().should('have.length', 1);
    });

    it('should allow adding rows', function() {
        editQcPage.getQuestion(0).getMatrixRows().should('have.length', 2);
    });

    it('should show the appropriate number of text inputs', function() {
        editQcPage.getQuestion(0).getMatrixTextInputs().should('have.length', 4);
    });

    it('should show the appropriate number of checkboxes', function() {
        editQcPage.getQuestion(0).getMatrixCheckboxes().should('have.length', 4);
    });

    it('should allow deleting rows', function() {
        editQcPage.getQuestion(0).deleteOption(editQcPage.getQuestion(0).getMatrixRows().eq(1));
        editQcPage.getQuestion(0).getMatrixRows().should('have.length', 1);
    });

    it('should throw a validation error if the labels are not filled in for rows and columns', function() {
        editQcPage.saveWithoutSuccess();
        editQcPage.getSaveSuccess().should('not.exist');
    });

    it('should throw a validation error if a correct answer isn\'t marked', function() {
        editQcPage.getQuestion(0).getMatrixTextInputs().eq(0).type(questionData.column1);
        editQcPage.getQuestion(0).getMatrixTextInputs().eq(1).type(questionData.column2);
        editQcPage.getQuestion(0).getMatrixTextInputs().eq(2).type(questionData.row1);
        editQcPage.getQuestion(0).getMatrixTextInputs().eq(3).type(questionData.row2);

        editQcPage.saveWithError();
        editQcPage.getSaveError().should('contain.text', data.validateNoCorrectMessage);
    });

    it('should allow checking an answer', function() {
        editQcPage.getQuestion(0).getMatrixCheckboxes().eq(0).click();
        editQcPage.getQuestion(0).getMatrixCheckboxes().eq(0).should('be.checked');
    });

    it('should only allow one answer per row', function() {
        editQcPage.getQuestion(0).getMatrixCheckboxes().eq(0).click();
        editQcPage.getQuestion(0).getMatrixCheckboxes().eq(1).click();
        editQcPage.getQuestion(0).getMatrixCheckboxes().eq(0).should('not.be.checked');
        editQcPage.getQuestion(0).getMatrixCheckboxes().eq(1).should('be.checked');
    });

    it('should not show an option for per-response feedback', function() {
        editQcPage.getQuestion(0).getFeedback().addCustomFeedback();
        editQcPage.getQuestion(0).getFeedback().getPerResponseFeedbackCheckbox().should('not.exist');
    });
});