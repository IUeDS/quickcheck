import data from '../../support/data/data';
import { qcPage } from '../../support/pages/qcPage';

describe('Taking a graded quick check and getting all answers correct', function() {
    before(() => {
        cy.refreshLocalDB();
        cy.newLocalAssessmentAllQuestionTypes();
        const url = data.urls.local.qcPreviewPage;
        cy.visit(url);
    });

    beforeEach(function () {
        
    });

    it('should randomize options when randomization is turned on', function() {
        qcPage.areOptionsRandomized().should('be.true');
    });

    describe('when on a multiple choice question', function() {
        it('should mark the answer as correct when answered correctly', function() {
            qcPage.getMcOptions().each((option, index) => {
                option.text().then((text) => {
                    if (text.includes(data.quizData.quiz1.question1.answer)) {
                        qcPage.selectMcOptionByIndex(index);
                        qcPage.submit();
                        qcPage.isCorrectModal().should('be.true');
                    }
                });
            });
        });

        it('should show per-response correct feedback if supplied', function() {
            qcPage.getPerResponseFeedback().should('have.length', 1);
            qcPage.getPerResponseFeedback().eq(0).should('contain', data.quizData.quiz1.question1.feedbackOption2);
            qcPage.clickContinue();
        });

        it('should increment the score after answering correctly', function() {
            qcPage.getScore().should('contain', '1 / 7 questions correct');
        });
    });

    describe('for a multiple correct question', function() {
        it('should mark the answer as correct when answered correctly', function() {
            qcPage.selectMCorrectOptionByIndex(data.quizData.quiz1.question2.answer1);
            qcPage.selectMCorrectOptionByIndex(data.quizData.quiz1.question2.answer2);
            qcPage.submit();
            qcPage.isCorrectModal().should('be.true');
        });

        it('should show per-response correct feedback if supplied', function() {
            qcPage.getPerResponseFeedback().should('have.length', 2);
            qcPage.getPerResponseFeedback().eq(0).should('contain', data.quizData.quiz1.question2.feedbackOption1);
            qcPage.getPerResponseFeedback().eq(1).should('contain', data.quizData.quiz1.question2.feedbackOption2);
            qcPage.clickContinue();
        });
    });

    describe('for a matrix question', function() {
        it('should mark the answer as correct when answered correctly', function() {
            qcPage.selectMatrixCheckboxByIndex(data.quizData.quiz1.question3.answer1);
            qcPage.selectMatrixCheckboxByIndex(data.quizData.quiz1.question3.answer2);
            qcPage.submit();
            qcPage.isCorrectRowFeedback().should('be.true');
        });

        it('should not show any incorrect rows', function() {
            qcPage.getIncorrectRows().should('have.length', 0);
        });

        it('should show question-level correct feedback if supplied', function() {
            qcPage.getRowFeedback().should('contain', data.quizData.quiz1.question3.feedbackCorrect);
            qcPage.clickRowContinue();
        });
    });

    describe('for a matching question', function() {
        it('should mark the answer as correct when a matching question has been answered correctly', function() {
            qcPage.selectOption(0, data.quizData.quiz1.question4.answer1);
            qcPage.selectOption(1, data.quizData.quiz1.question4.answer2);
            qcPage.submit();
            qcPage.isCorrectRowFeedback().should('be.true');
        });

        it('should not show any incorrect rows', function() {
            qcPage.getIncorrectRows().should('have.length', 0);
            qcPage.clickRowContinue();
        });
    });

    describe('for a multiple dropdowns question', function() {
        it('should mark the answer as correct when a multiple dropdown question has been answered correctly', function() {
            qcPage.selectOption(0, data.quizData.quiz1.question5.answer1);
            qcPage.selectOption(1, data.quizData.quiz1.question5.answer2);
            qcPage.submit();
            qcPage.isCorrectModal().should('be.true');
            qcPage.clickContinue();
        });
    });

    describe('for a textmatch question', function() {
        it('should mark the answer as correct when a textmatch question has been answered correctly, and match regardless of capitalization, punctuation, or trailing spaces', function() {
            qcPage.enterTextmatchAnswer(data.quizData.quiz1.question6.option1.toLowerCase() + '!    ');
            qcPage.submit();
            qcPage.isCorrectModal().should('be.true');
            qcPage.clickContinue();
        });
    });

    describe('for a numerical question', function() {
        it('should mark the answer as correct when a numeric question has been answered correctly', function() {
            qcPage.enterNumericalAnswer(data.quizData.quiz1.question7.option1);
            qcPage.submit();
            qcPage.isCorrectModal().should('be.true');
            qcPage.clickContinue();
        });
    });

    it('should show the completion modal when finished', function() {
        qcPage.isCompletionModalVisible().should('be.true');
    });

    it('should show a perfect score when all answers were answered correctly', function() {
        qcPage.getFinalScore().should('contain', 'score: 7 / 7 questions correct');
    });
});