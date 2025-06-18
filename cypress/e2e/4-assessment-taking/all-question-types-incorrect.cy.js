import { setPage } from '../../support/pages/setPage';
import data from '../../support/data/data';
import { qcPage } from '../../support/pages/qcPage';

describe('Taking an assessment with all question types and incorrect answers', function() {
    before(() => {
        cy.refreshLocalDB();
        cy.newLocalAssessmentAllQuestionTypes();
        const url = data.urls.local.qcPreviewPage;
        cy.visit(url);
    });

    beforeEach(function () {
        
    });
    
    it('should not show a title if it is not present', function() {
        qcPage.getTitle().should('not.exist');
    });

    it('should not show a description if it is not present', function() {
        qcPage.getDescription().should('not.exist');
    });

    it('should show the correct number of questions in the quiz', function() {
        qcPage.getQuestionProgress().should('contain', 'question 1 out of 7');
    });

    it('should begin with a score of 0', function() {
        qcPage.getScore().should('contain', '0 / 7 questions correct');
    });

    describe('when on a multiple choice question', function() {
        it('should show the proper question text', function() {
            qcPage.getQuestionText().should('contain', data.quizData.quiz1.question1.questionText);
        });

        it('should show the options correctly', function() {
            //TODO: test the actual text from data file
            qcPage.getMcOptions().each((option) => {
                qcPage.getMcOptionsText().should('include', option.text());
            });
        });

        it('should disable the submit button until a multiple choice answer is selected', function() {
            qcPage.isSubmitBtnDisabled().should('be.true');
        });

        it('should mark the multiple choice question as incorrect when answered incorrectly', function() {
            //TODO: not random
            qcPage.selectIncorrectRandomMcOption(data.quizData.quiz1.question1.answer);
            qcPage.submit();
            qcPage.isIncorrectModal().should('be.true');
        });

        it('should show per-response incorrect feedback for a multiple choice question if supplied', function() {
            qcPage.getPerResponseFeedback().should('have.length', 1);
            qcPage.clickContinue();
        });

        it('should not increment the score when the question was answered incorrectly', function() {
            qcPage.getScore().should('contain', '0 / 7 questions correct');
        });
    });

    describe('when on a multiple correct question', function() {
        it('should increment the question number after the first question', function() {
            qcPage.getQuestionProgress().should('contain', 'question 2 out of 7');
        });

        it('should properly show the question and options', function() {
            qcPage.getQuestionText().should('be.empty');
            qcPage.getMCorrectOptions().should('have.length', 4);
        });

        it('should show the options in the order saved when the question is not randomized', function() {
            qcPage.getMCorrectOptions().eq(0).should('contain', data.quizData.quiz1.question2.option1);
            qcPage.getMCorrectOptions().eq(1).should('contain', data.quizData.quiz1.question2.option2);
            qcPage.getMCorrectOptions().eq(2).should('contain', data.quizData.quiz1.question2.option3);
            qcPage.getMCorrectOptions().eq(3).should('contain', data.quizData.quiz1.question2.option4);
        });

        it('should disable the submit button until an answer is selected', function() {
            qcPage.isSubmitBtnDisabled().should('be.true');
        });

        it('should mark the question as incorrect when answered incorrectly', function() {
            qcPage.selectMCorrectOptionByIndex(0);
            qcPage.submit();
            qcPage.isIncorrectModal().should('be.true');
        });

        it('should show per-response incorrect feedback if supplied', function() {
            qcPage.getPerResponseFeedback().should('have.length', 1);
            qcPage.getPerResponseFeedback().eq(0).should('contain', data.quizData.quiz1.question2.feedbackOption1);
            qcPage.clickContinue();
        });
    });

    describe('when on a matrix question', function() {
        it('should properly show the question', function() {
            qcPage.getQuestionText().should('be.empty');
        });

        it('should properly show the column text', function() {
            qcPage.getMatrixColumnCells().eq(1).should('contain', data.quizData.quiz1.question3.column1);
            qcPage.getMatrixColumnCells().eq(2).should('contain', data.quizData.quiz1.question3.column2);
        });

        it('should properly show the row text', function() {
            qcPage.getMatrixRowCells().eq(0).should('contain', data.quizData.quiz1.question3.row1);
            qcPage.getMatrixRowCells().eq(1).should('contain', data.quizData.quiz1.question3.row2);
        });

        it('should have the correct number of checkboxes', function() {
            qcPage.getMatrixCheckboxes().should('have.length', 4);
        });

        it('should disable the submit button until all answers are selected', function() {
            qcPage.isSubmitBtnDisabled().should('be.true');
        });

        it('should only allow one selection per row', function() {
            qcPage.selectMatrixCheckboxByIndex(0);
            qcPage.getMatrixCheckboxes().eq(0).should('be.checked');
            qcPage.getMatrixCheckboxes().eq(1).should('not.be.checked');
            qcPage.selectMatrixCheckboxByIndex(1);
            qcPage.getMatrixCheckboxes().eq(0).should('not.be.checked');
            qcPage.getMatrixCheckboxes().eq(1).should('be.checked');
        });

        it('should show incorrect feedback', function() {
            qcPage.submit();
            qcPage.isIncorrectRowFeedback().should('be.true');
        });

        it('should show incorrect rows', function() {
            qcPage.getIncorrectRows().should('have.length', 2);
        });

        it('should show incorrect feedback if supplied', function() {
            qcPage.getRowFeedback().should('contain', data.quizData.quiz1.question3.feedbackIncorrect);
            qcPage.clickRowContinue();
        });
    });

    describe('when on a matching question', function() {
        it('should properly show the question', function() {
            qcPage.getQuestionText().should('be.empty');
        });

        it('should show the prompts', function() {
            qcPage.getMatchingPrompts().eq(0).should('contain', data.quizData.quiz1.question4.prompt1);
            qcPage.getMatchingPrompts().eq(1).should('contain', data.quizData.quiz1.question4.prompt2);
        });

        it('should show the answer options in the dropdowns', function() {
            qcPage.getSelects().eq(0).should('contain', data.quizData.quiz1.question4.answer1);
            qcPage.getSelects().eq(1).should('contain', data.quizData.quiz1.question4.answer2);
        });

        it('should disable the submit button until all matching answers are selected', function() {
            qcPage.isSubmitBtnDisabled().should('be.true');
        });

        it('should show incorrect feedback', function() {
            qcPage.selectOption(1, data.quizData.quiz1.question4.distractor);
            qcPage.submit();
            qcPage.isIncorrectRowFeedback().should('be.true');
        });

        it('should show incorrect rows', function() {
            qcPage.getIncorrectRows().should('have.length', 2);
            qcPage.clickRowContinue();
        });
    });

    describe('when on a multiple dropdowns question', function() {
        it('should properly show the question', function() {
            qcPage.getQuestionText().should('be.empty');
        });

        it('should properly display prompts', function() {
            qcPage.getDropdownPrompts().eq(0).should('contain', data.quizData.quiz1.question5.prompt1);
            qcPage.getDropdownPrompts().eq(1).should('contain', data.quizData.quiz1.question5.prompt2);
        });

        it('should properly display answer options, including distractors', function() {
            qcPage.getSelects().eq(0).should('contain', data.quizData.quiz1.question5.answer1);
            qcPage.getSelects().eq(1).should('contain', data.quizData.quiz1.question5.answer2);
            qcPage.getSelects().eq(2).should('contain', data.quizData.quiz1.question5.distractor);
        });

        it('should disable the submit button until all multiple dropdown answers are selected', function() {
            qcPage.isSubmitBtnDisabled().should('be.true');
        });

        it('should show incorrect feedback', function() {
            qcPage.selectOption(1, data.quizData.quiz1.question5.distractor);
            qcPage.submit();
            qcPage.isIncorrectModal().should('be.true');
            qcPage.clickContinue();
        });
    });

    describe('when on a textmatch question', function() {
        it('should properly show a textmatch question', function() {
            qcPage.getQuestionText().should('be.empty');
        });

        it('should disable the submit button until a textmatch answer is selected', function() {
            qcPage.isSubmitBtnDisabled().should('be.true');
        });

        it('should mark the textmatch answer as incorrect when answered incorrectly', function() {
            qcPage.enterTextmatchAnswer('Totally the wrong answer');
            qcPage.submit();
            qcPage.isIncorrectModal().should('be.true');
            qcPage.clickContinue();
        });
    });

    describe('when on a numerical question', function() {
        it('should properly show a numeric question', function() {
            qcPage.getQuestionText().should('be.empty');
        });

        it('should disable the submit button until a numeric answer is selected', function() {
            qcPage.isSubmitBtnDisabled().should('be.true');
        });

        it('should mark the numeric question as incorrect when answered incorrectly', function() {
            qcPage.enterNumericalAnswer('10000000');
            qcPage.submit();
            qcPage.isIncorrectModal().should('be.true');
        });
    });

    describe('when the quick check is finished', function() {
        it('should show a message that the quick check has been completed', function() {
            qcPage.clickContinue();
            qcPage.isQcFinished().should('be.true');
        });

        it('should show a score of 0 when all questions were answered incorrectly', function() {
            qcPage.getFinalScore().should('contain', 'score: 0 / 7 questions correct');
        });
    });
});