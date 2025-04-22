import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';

describe('Adding a multiple dropdowns question', function() {
    before(() => {
        cy.newLocalAssessment();
    });

    beforeEach(function () {
        const url = data.urls.local.qcEditPage;
        cy.visit(url);
        cy.get('.loader').should('not.be.visible');
        editQcPage.addQuestion();
        editQcPage.getQuestion(0).setQuestionType(data.questionTypes.dropdowns);
    });

    it('should not feature a randomize options checkbox', function() {
        editQcPage.getQuestion(0).getRandomizedCheckbox().should('not.exist');
    });

    it('should allow adding dropdown pairs', function() {
        editQcPage.getQuestion(0).addDropdownPair();
        editQcPage.getQuestion(0).getDropdownPrompts().should('have.length', 1);
    });

    it('should throw a validation error if a dropdown pair field isn\'t filled', function() {
        editQcPage.getQuestion(0).addDropdownPair();
        editQcPage.saveWithoutSuccess();
        editQcPage.getSaveSuccess().should('not.exist');
    });

    it('should allow deleting dropdown pairs', function() {
        editQcPage.getQuestion(0).addDropdownPair();
        editQcPage.getQuestion(0).addDropdownPair();
        editQcPage.getQuestion(0).deleteOption(editQcPage.getQuestion(0).getDropdownPrompts().eq(0));
        editQcPage.getQuestion(0).getDropdownPrompts().should('have.length', 1);
    });

    it('should allow adding distractors', function() {
        editQcPage.getQuestion(0).addDistractor();
        editQcPage.getQuestion(0).getDropdownDistractors().should('have.length', 1);
    });

    it('should throw a validation error if a distractor field isn\'t filled', function() {
        editQcPage.getQuestion(0).addDistractor();
        editQcPage.saveWithoutSuccess();
        editQcPage.getSaveSuccess().should('not.exist');
    });

    it('should allow deleting distractors', function() {
        editQcPage.getQuestion(0).addDistractor();
        editQcPage.getQuestion(0).addDistractor();
        editQcPage.getQuestion(0).deleteOption(editQcPage.getQuestion(0).getDropdownDistractors().eq(1));
        editQcPage.getQuestion(0).getDropdownDistractors().should('have.length', 1);
    });

    it('should not show an option for per-response feedback', function() {
        const feedback = editQcPage.getFeedback(0);
        feedback.addCustomFeedback();
        feedback.getPerResponseFeedbackCheckbox().should('not.exist');
    });
});