import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';
import { common } from '../../support/common';

describe('Editing an assessment', function () {
    const sets = data.sets;

    before(() => {
        cy.newLocalAssessment();
    });

    beforeEach(() => {
        const url = data.urls.local.qcEditPage;
        cy.visit(url);
        cy.get('.loader').should('not.be.visible');
        editQcPage.addQuestion();
    });

    it('should show the correct assessment name and assessment group', function () {
        editQcPage.getAssessmentName().should('eq', sets.toBeDeleted.quickchecks.test);
        editQcPage.getSubsetSelect().find('option:selected').invoke('text').then((selectedText) => {
            expect(selectedText).to.eq(sets.toBeDeleted.subsets.group1);
        });
    });

    it('should automatically add a multiple choice question with 4 options when adding a question', function() {
        editQcPage.getQuestion(0).getQuestionType().should('eq', data.questionTypes.mc);
    });

    it('should not show reordering icons if there is only a single question', function() {
        editQcPage.getQuestion(0).getReorderUpBtn().should('not.exist');
        editQcPage.getQuestion(0).getReorderDownBtn().should('not.exist');
    });

    it('should show the custom feedback panel when the button is clicked', function() {
        const feedback = editQcPage.getFeedback(0);
        feedback.addCustomFeedback();
        feedback.getFeedbackPanel().should('be.visible');
        feedback.getCorrectFeedback().should('be.visible');
        feedback.getIncorrectFeedback().should('be.visible');
    });

    it('should remove the custom feedback panel when the delete button is clicked', function() {
        const feedback = editQcPage.getFeedback(0);
        feedback.addCustomFeedback();
        feedback.deleteFeedback();
        feedback.getFeedbackPanel().should('not.exist');
    });

    it('should remove the question and re-order when the delete question button is clicked', function() {
        editQcPage.addQuestion();
        editQcPage.getQuestion(0).deleteQuestion();
        editQcPage.getQuestions().should('have.length', 1);
        editQcPage.getQuestions().eq(0).should('contain.text', 'question #1');
    });

    it('should display a confirm message when navigating away from a quick check without saving', function () {
        editQcPage.goBack();
        common.acceptAlert();
    });
});