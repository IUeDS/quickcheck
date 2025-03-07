import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';

describe('Reordering questions', function() {
    before(() => {
        cy.newLocalAssessment();
    });

    beforeEach(() => {
        const url = data.urls.local.qcEditPage;
        cy.visit(url);
        cy.get('.loader').should('not.be.visible');
        editQcPage.addQuestion();
    });

    it('should not show a reorder up arrow if it is the first question', function() {
        const question = editQcPage.getQuestion(0);
        question.getReorderUpBtn().should('not.exist');
    });

    it('should not show a reorder down arrow if it is the last question', function() {
        editQcPage.addQuestion();
        editQcPage.getQuestion(1).getReorderDownBtn().should('not.exist');
    });

    it('should move a question up if the reorder up arrow is clicked', function() {
        editQcPage.addQuestion();
        editQcPage.getQuestion(1).setQuestionType(data.questionTypes.numerical);
        editQcPage.getQuestion(1).getReorderUpBtn().click();
        editQcPage.getQuestion(0).getQuestionType().should('eq', data.questionTypes.numerical);
        editQcPage.getQuestion(0).getHeaderText().should('eq', 'question #1');
        editQcPage.getQuestion(1).getQuestionType().should('eq', data.questionTypes.mc);
        editQcPage.getQuestion(1).getHeaderText().should('eq', 'question #2');
    });

    it('should move a question down if the reorder down arrow is clicked', function() {
        editQcPage.getQuestion(0).setQuestionType(data.questionTypes.numerical);
        editQcPage.addQuestion();
        editQcPage.getQuestion(0).getReorderDownBtn().click();
        editQcPage.getQuestion(1).getQuestionType().should('eq', data.questionTypes.numerical);
        editQcPage.getQuestion(1).getHeaderText().should('eq', 'question #2');
        editQcPage.getQuestion(0).getQuestionType().should('eq', data.questionTypes.mc);
        editQcPage.getQuestion(0).getHeaderText().should('eq', 'question #1');
    });
});