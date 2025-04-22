import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';

describe('Adding a matching question', function() {
    const questionData = data.quizData.quiz1.question3;

    before(() => {
        cy.newLocalAssessment();
    });

    beforeEach(function () {
        const url = data.urls.local.qcEditPage;
        cy.visit(url);
        cy.get('.loader').should('not.be.visible');
        editQcPage.addQuestion();
        editQcPage.getQuestion(0).setQuestionType(data.questionTypes.matching);
    });

    it('should default to randomizing answer option order', function() {
        editQcPage.getQuestion(0).isRandomized().should('be.true');
        editQcPage.getQuestion(0).toggleRandomized();
    });

    it('should allow adding matching pairs', function() {
        editQcPage.getQuestion(0).addMatchingPair();
        editQcPage.getQuestion(0).getMatchingPrompts().should('have.length', 1);
    });

    it('should throw a validation error if a matching pair field isn\'t filled', function() {
        editQcPage.getQuestion(0).addMatchingPair();
        editQcPage.saveWithoutSuccess();
        editQcPage.getSaveSuccess().should('not.exist');
    });

    it('should allow deleting matching pairs', function() {
        editQcPage.getQuestion(0).addMatchingPair();
        editQcPage.getQuestion(0).addMatchingPair();
        editQcPage.getQuestion(0).getMatchingPairInputs().eq(0).type(data.quizData.quiz1.question4.prompt1);
        editQcPage.getQuestion(0).getMatchingPairInputs().eq(1).type(data.quizData.quiz1.question4.answer1);
        editQcPage.getQuestion(0).getMatchingPairInputs().eq(2).type(data.quizData.quiz1.question4.prompt2);
        editQcPage.getQuestion(0).getMatchingPairInputs().eq(3).type(data.quizData.quiz1.question4.answer2);
        editQcPage.getQuestion(0).addMatchingPair();
        editQcPage.getQuestion(0).deleteOption(editQcPage.getQuestion(0).getMatchingPrompts().eq(2));
        editQcPage.getQuestion(0).getMatchingPrompts().should('have.length', 2);
    });

    it('should allow adding distractors', function() {
        editQcPage.getQuestion(0).addDistractor();
        editQcPage.getQuestion(0).getMatchingDistractors().should('have.length', 1);
    });

    it('should throw a validation error if a distractor field isn\'t filled', function() {
        editQcPage.getQuestion(0).addDistractor();
        editQcPage.saveWithoutSuccess();
        editQcPage.getSaveSuccess().should('not.exist');
    });

    it('should allow deleting distractors', function() {
        editQcPage.getQuestion(0).addDistractor();
        editQcPage.getQuestion(0).addDistractor();
        editQcPage.getQuestion(0).deleteOption(editQcPage.getQuestion(0).getMatchingDistractors().eq(0));
        editQcPage.getQuestion(0).getMatchingDistractors().should('have.length', 1);
    });

    it('should not show an option for per-response feedback', function() {
        const feedback = editQcPage.getFeedback(0);
        feedback.addCustomFeedback();
        feedback.getPerResponseFeedbackCheckbox().should('not.exist');
    });
});