import { editQcPage } from '../../support/pages/editQcPage';
import data from '../../support/data/data';
import { common } from '../../support/common';

describe('Using the rich content editor toggle', function() {
    let option,
        question,
        submittedText = 'Test content, will be deleted.',
        richText = '<p>' + submittedText + '</p>';
    
    before(() => {
        cy.newLocalAssessment();
    });

    describe('in multiple choice questions', function() {  
        beforeEach(() => {
            const url = data.urls.local.qcEditPage;
            cy.visit(url);
            cy.get('.loader').should('not.be.visible');
            editQcPage.addQuestion();
            question = editQcPage.getQuestion(0);
            option = question.getMcOptions().eq(0);
        });

        it('should show a toggle', function() {
            question.getRichContentToggle().should('be.visible');
        });

        it('should show a rich content editor and hide input element when toggle is enabled', function() {
            question.enterMcTextOption(option, submittedText);
            editQcPage.getQuestion(0).toggleRichContent();
            option = editQcPage.getQuestion(0).getMcOptions().eq(0); //cypress references can only be used once, I've learned...set again.
            common.getTinyMceIframeFromElement(option, true).should('be.visible');
            question.getMcOptionInput(option).should('not.exist');
            option = editQcPage.getQuestion(0).getMcOptions().eq(0);
            common.getTinyMceText(option).should('eq', submittedText);
        });

        it('should remove the rich content editor when toggle is disabled and retain information', function() {
            question.enterMcTextOption(option, submittedText);
            editQcPage.getQuestion(0).toggleRichContent();
            editQcPage.getQuestion(0).toggleRichContent();
            option = editQcPage.getQuestion(0).getMcOptions().eq(0);
            editQcPage.getQuestion(0).getMcOptionInput(option).should('be.visible');
            option = editQcPage.getQuestion(0).getMcOptions().eq(0);
            editQcPage.getQuestion(0).getMcOptionInputValue(option).should('eq', richText);
        });
    });

    describe('in a multiple correct question', function() {
        beforeEach(() => {
            const url = data.urls.local.qcEditPage;
            cy.visit(url);
            cy.get('.loader').should('not.be.visible');
            editQcPage.addQuestion();
            editQcPage.getQuestion(0).setQuestionType(data.questionTypes.mcorrect);
            option = editQcPage.getQuestion(0).getMCorrectOptions().eq(0);
            question = editQcPage.getQuestion(0);
        });

        it('should show a toggle', function() {
            question.getRichContentToggle().should('be.visible');
        });

        it('should show a rich content editor when toggle is enabled', function() {
            question.enterMcTextOption(option, submittedText);
            question.toggleRichContent();
            option = editQcPage.getQuestion(0).getMCorrectOptions().eq(0);
            common.getTinyMceText(option).should('eq', submittedText);
            option = editQcPage.getQuestion(0).getMCorrectOptions().eq(0);
            question.getMCorrectOptionInput(option).should('not.exist');
        });

        it('should remove the rich content editor when toggle is disabled', function() {
            question.enterMcTextOption(option, submittedText);
            editQcPage.getQuestion(0).toggleRichContent();
            editQcPage.getQuestion(0).toggleRichContent();
            option = editQcPage.getQuestion(0).getMCorrectOptions().eq(0);
            editQcPage.getQuestion(0).getMCorrectOptionInput(option).should('be.visible');
            option = editQcPage.getQuestion(0).getMcOptions().eq(0);
            editQcPage.getQuestion(0).getMCorrectOptionInputValue(option).should('eq', richText);
        });
    });

    describe('in the feedback panel', function() {
        var correctFeedbackContainer,
            responseFeedbackOption;

        beforeEach(function() {
            const url = data.urls.local.qcEditPage;
            cy.visit(url);
            cy.get('.loader').should('not.be.visible');
            editQcPage.addQuestion();
            editQcPage.getQuestion(0).feedback.addCustomFeedback();        
        });

        describe('for basic feedback', function() {
            it('should show a toggle', function() {
                editQcPage.getQuestion(0).feedback.getRichContentToggle().should('be.visible');
            });

            it('should show a rich content editor when toggle is enabled', function() {
                editQcPage.getQuestion(0).feedback.getCorrectFeedback().type(submittedText);
                editQcPage.getQuestion(0).feedback.toggleRichContent();
                correctFeedbackContainer = editQcPage.getQuestion(0).feedback.getCorrectFeedbackContainer();
                common.getTinyMceIframeFromElement(correctFeedbackContainer, true).should('be.visible');

                correctFeedbackContainer = editQcPage.getQuestion(0).feedback.getCorrectFeedbackContainer();
                common.getTinyMceText(correctFeedbackContainer).should('eq', submittedText);

                let correctFeedback = editQcPage.getQuestion(0).feedback.getCorrectFeedback();
                correctFeedback.should('not.be.visible');
            });

            it('should remove the rich content editor when toggle is disabled', function() {
                editQcPage.getQuestion(0).feedback.getCorrectFeedback().type(submittedText);
                editQcPage.getQuestion(0).feedback.toggleRichContent();
                editQcPage.getQuestion(0).feedback.toggleRichContent();

                correctFeedbackContainer = editQcPage.getQuestion(0).feedback.getCorrectFeedbackContainer();
                editQcPage.getQuestion(0).feedback.getCorrectFeedback().should('be.visible');
                editQcPage.getQuestion(0).feedback.getCorrectFeedback().invoke('val').should('eq', richText);
            });
        });

        describe('for per-option feedback', function() {
            it('should show a toggle', function() {
                editQcPage.getQuestion(0).feedback.togglePerResponseFeedback();
                editQcPage.getQuestion(0).feedback.getRichContentToggle().should('be.visible');
            });

            it('should show a rich content editor when toggle is enabled and retain content', function() {
                editQcPage.getQuestion(0).feedback.togglePerResponseFeedback();
                responseFeedbackOption = editQcPage.getQuestion(0).feedback.getPerResponseFeedbackOptions().eq(0);
                editQcPage.getQuestion(0).feedback.enterResponseFeedback(responseFeedbackOption, submittedText);
                editQcPage.getQuestion(0).feedback.toggleRichContent();

                responseFeedbackOption = editQcPage.getQuestion(0).feedback.getPerResponseFeedbackOptions().eq(0);
                common.getTinyMceIframeFromElement(responseFeedbackOption, true).should('be.visible');

                responseFeedbackOption = editQcPage.getQuestion(0).feedback.getPerResponseFeedbackOptions().eq(0);
                common.getTinyMceText(responseFeedbackOption).should('eq', submittedText);
            });

            it('should remove the rich content editor when toggle is disabled', function() {
                editQcPage.getQuestion(0).feedback.togglePerResponseFeedback();
                responseFeedbackOption = editQcPage.getQuestion(0).feedback.getPerResponseFeedbackOptions().eq(0);
                editQcPage.getQuestion(0).feedback.enterResponseFeedback(responseFeedbackOption, submittedText);
                editQcPage.getQuestion(0).feedback.toggleRichContent();
                editQcPage.getQuestion(0).feedback.toggleRichContent();

                responseFeedbackOption = editQcPage.getQuestion(0).feedback.getPerResponseFeedbackOptions().eq(0);
                editQcPage.getQuestion(0).feedback.getPerResponseFeedbackInput(responseFeedbackOption).should('be.visible');

                responseFeedbackOption = editQcPage.getQuestion(0).feedback.getPerResponseFeedbackOptions().eq(0);
                editQcPage.getQuestion(0).feedback.getPerResponseFeedbackInput(responseFeedbackOption).invoke('val').should('eq', richText);
            });
        });
    });

    describe('in other question types', function() {
        beforeEach(function() {
            const url = data.urls.local.qcEditPage;
            cy.visit(url);
            cy.get('.loader').should('not.be.visible');
            editQcPage.addQuestion();
            question = editQcPage.getQuestion(0);
        });

        it('should not appear for matching questions', function() {
            question.setQuestionType(data.questionTypes.matching);
            editQcPage.getQuestion(0).getRichContentToggle().should('not.exist');
        });

        it('should not appear for matrix questions', function() {
            question.setQuestionType(data.questionTypes.matrix);
            editQcPage.getQuestion(0).getRichContentToggle().should('not.exist');
        });

        it('should not appear for dropdown questions', function() {
            question.setQuestionType(data.questionTypes.dropdowns);
            editQcPage.getQuestion(0).getRichContentToggle().should('not.exist');
        });

        it('should not appear for textmatch questions', function() {
            question.setQuestionType(data.questionTypes.textmatch);
            editQcPage.getQuestion(0).getRichContentToggle().should('not.exist');
        });

        it('should not appear for numerical questions', function() {
            question.setQuestionType(data.questionTypes.numerical);
            editQcPage.getQuestion(0).getRichContentToggle().should('not.exist');
        });
    });
});