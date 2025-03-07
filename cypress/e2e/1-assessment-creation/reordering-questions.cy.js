import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';
import { common } from '../../support/common';

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

//     it('should not show a reorder down arrow if it is the last question', function() {
//         const question = editQcPage.getQuestion(1);
//         question.getReorderDownBtn().should('not.exist');
//     });

//     it('should move a question up if the reorder up arrow is clicked', function() {
//         const question = editQcPage.getQuestion(1);
//         question.getReorderUpBtn().click();
//         editQcPage.initQuestions();
//         const movedQuestion = editQcPage.getQuestion(0);
//         movedQuestion.getQuestionType().should('eq', data.questionTypes.numerical);
//     });

//     it('should show the appropriate question number when the up arrow is clicked', function() {
//         editQcPage.getQuestion(0).getHeaderText().should('eq', 'question #1');
//     });

//     it('should displace the previous question if the reorder up arrow is clicked', function() {
//         editQcPage.getQuestion(1).getQuestionType().should('eq', data.questionTypes.mc);
//     });

//     it('should show the appropriate question number for the displaced question below', function() {
//         editQcPage.getQuestion(1).getHeaderText().should('eq', 'question #2');
//     });

//     it('should move a question down if the reorder down arrow is clicked', function() {
//         const question = editQcPage.getQuestion(0);
//         question.getReorderDownBtn().click();
//         editQcPage.initQuestions();
//         const movedQuestion = editQcPage.getQuestion(1);
//         movedQuestion.getQuestionType().should('eq', data.questionTypes.numerical);
//     });

//     it('should show the appropriate question number when the down arrow is clicked', function() {
//         editQcPage.getQuestion(1).getHeaderText().should('eq', 'question #2');
//     });

//     it('should displace the previous question if the reorder down arrow is clicked', function() {
//         editQcPage.getQuestion(0).getQuestionType().should('eq', data.questionTypes.mc);
//     });

//     it('should show the appropriate question number for the displaced question above', function() {
//         editQcPage.getQuestion(0).getHeaderText().should('eq', 'question #1');
//     });
});