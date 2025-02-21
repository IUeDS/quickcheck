import { editQcPage } from '../../support/pages/editQcPage';
import { EditFeedbackComponent } from '../../support/components/editFeedbackComponent';
import data from '../../support/data/data';

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

    // it('should show the correct assessment name and assessment group', function () {
    //     editQcPage.getAssessmentName().should('eq', sets.toBeDeleted.quickchecks.test);
    //     editQcPage.getSubsetSelect().find('option:selected').invoke('text').then((selectedText) => {
    //         expect(selectedText).to.eq(sets.toBeDeleted.subsets.group1);
    //     });
    // });

    // it('should automatically add a multiple choice question with 4 options when adding a question', function() {
    //     editQcPage.getQuestion(0).getQuestionType().should('eq', data.questionTypes.mc);
    // });

    // it('should not show reordering icons if there is only a single question', function() {
    //     editQcPage.getQuestion(0).getReorderUpBtn().should('not.exist');
    //     editQcPage.getQuestion(0).getReorderDownBtn().should('not.exist');
    // });

    // it('should show the custom feedback panel when the button is clicked', function() {
    //     const feedback = editQcPage.getFeedback(0);
    //     feedback.addCustomFeedback();
    //     feedback.getFeedbackPanel().should('be.visible');
    //     feedback.getCorrectFeedback().should('be.visible');
    //     feedback.getIncorrectFeedback().should('be.visible');
    // });

    // it('should remove the custom feedback panel when the delete button is clicked', function() {
    //     const feedback = editQcPage.getFeedback(0);
    //     feedback.addCustomFeedback();
    //     feedback.deleteFeedback();
    //     feedback.getFeedbackPanel().should('not.exist');
    // });

    // it('should remove the question and re-order when the delete question button is clicked', function() {
    //     editQcPage.addQuestion();
    //     editQcPage.getQuestion(0).deleteQuestion();
    //     editQcPage.getQuestions().should('have.length', 1);
    //     editQcPage.getQuestions().eq(0).should('contain.text', 'question #1');
    // });
});

// describe('Using the rich content editor toggle', function() {
//     var option,
//         question,
//         submittedText = 'Test content, will be deleted.',
//         richText = '<p>' + submittedText + '</p>';

//     describe('in a multiple choice question', function() {
//         beforeEach(function() {
//             question = editQcPage.getQuestion(0);
//             option = question.getOptions().eq(0);
//         });

//         it('should show a toggle', function() {
//             question.getRichContentToggle().should('be.visible');
//         });

//         it('should show a rich content editor when toggle is enabled', function() {
//             question.enterMcTextOption(option, submittedText);
//             question.toggleRichContent();
//             common.getTinyMceIframeFromElement(option, true).should('be.visible');
//         });

//         it('should remove the basic input element when toggle is enabled', function() {
//             question.getOptionInput(option).should('not.exist');
//         });

//         it('should retain existing information when toggle is enabled', function() {
//             common.enterTinyMceIframeInElement(option);
//             common.getTinyMceText(option).should('eq', submittedText);
//             common.leaveTinyMceIframe();
//             common.enterAngularPage();
//         });

//         it('should remove the rich content editor when toggle is disabled', function() {
//             question.toggleRichContent();
//             common.getTinyMceIframeFromElement(option).should('not.exist');
//         });

//         it('should show the basic input element when the toggle is disabled', function() {
//             question.getOptionInput(option).should('be.visible');
//         });

//         it('should retain existing information when the toggle is disabled', function() {
//             question.getMcOptionInputValue(option).should('eq', richText);
//             editQcPage.addQuestion(data.questionTypes.mcorrect);
//             editQcPage.initQuestions();
//         });
//     });

//     describe('in a multiple correct question', function() {
//         beforeEach(function() {
//             question = editQcPage.getQuestion(1);
//             option = question.getOptions().eq(0);
//         });

//         it('should show a toggle', function() {
//             question.getRichContentToggle().should('be.visible');
//         });

//         it('should show a rich content editor when toggle is enabled', function() {
//             question.enterMcTextOption(option, submittedText);
//             question.toggleRichContent();
//             common.getTinyMceIframeFromElement(option, true).should('be.visible');
//         });

//         it('should remove the basic input element when toggle is enabled', function() {
//             question.getOptionInput(option).should('not.exist');
//         });

//         it('should retain existing information when toggle is enabled', function() {
//             common.enterTinyMceIframeInElement(option);
//             common.getTinyMceText(option).should('eq', submittedText);
//             common.leaveTinyMceIframe();
//             common.enterAngularPage();
//         });

//         it('should remove the rich content editor when toggle is disabled', function() {
//             question.toggleRichContent();
//             common.getTinyMceIframeFromElement(option).should('not.exist');
//         });

//         it('should show the basic input element when the toggle is disabled', function() {
//             question.getOptionInput(option).should('be.visible');
//         });

//         it('should retain existing information when the toggle is disabled', function() {
//             question.getMcOptionInputValue(option).should('eq', richText);
//         });
//     });

//     describe('in the feedback panel', function() {
//         var correctFeedbackContainer,
//             responseFeedbackOption;

//         beforeEach(function() {
//             question = editQcPage.getQuestion(1);
//         });

//         describe('for basic feedback', function() {
//             it('should show a toggle', function() {
//                 question.feedback.addCustomFeedback();
//                 question.feedback.getRichContentToggle().should('be.visible');
//             });

//             it('should show a rich content editor when toggle is enabled', function() {
//                 correctFeedbackContainer = question.feedback.getCorrectFeedbackContainer();
//                 question.feedback.getCorrectFeedback().type(submittedText);
//                 question.feedback.toggleRichContent();
//                 common.getTinyMceIframeFromElement(correctFeedbackContainer, true).should('be.visible');
//             });

//             it('should retain existing information when toggle is enabled', function() {
//                 common.enterTinyMceIframeInElement(correctFeedbackContainer);
//                 common.getTinyMceText(correctFeedbackContainer).should('eq', submittedText);
//                 common.leaveTinyMceIframe();
//                 common.enterAngularPage();
//             });

//             it('should remove the rich content editor when toggle is disabled', function() {
//                 question.feedback.toggleRichContent();
//                 common.getTinyMceIframeFromElement(correctFeedbackContainer).should('not.exist');
//             });

//             it('should show the basic input element when the toggle is disabled', function() {
//                 question.feedback.getCorrectFeedback().should('be.visible');
//             });
//         });

//         describe('for per-option feedback', function() {
//             it('should show a toggle', function() {
//                 question.feedback.togglePerResponseFeedback();
//                 question.feedback.getRichContentToggle().should('be.visible');
//             });

//             it('should show a rich content editor when toggle is enabled', function() {
//                 responseFeedbackOption = question.feedback.getPerResponseFeedbackOptions().eq(0);
//                 question.feedback.enterResponseFeedback(responseFeedbackOption, submittedText);
//                 question.feedback.toggleRichContent();
//                 common.getTinyMceIframeFromElement(responseFeedbackOption, true).should('be.visible');
//             });

//             it('should retain existing information when toggle is enabled', function() {
//                 common.enterTinyMceIframeInElement(responseFeedbackOption);
//                 common.getTinyMceText(responseFeedbackOption).should('eq', submittedText);
//                 common.leaveTinyMceIframe();
//                 common.enterAngularPage();
//             });

//             it('should remove the rich content editor when toggle is disabled', function() {
//                 question.feedback.toggleRichContent();
//                 common.getTinyMceIframeFromElement(responseFeedbackOption).should('not.exist');
//             });

//             it('should show the basic input element when the toggle is disabled', function() {
//                 question.feedback.getPerResponseFeedbackInput(responseFeedbackOption).should('be.visible');
//             });
//         });
//     });

//     describe('in other question types', function() {
//         it('should not appear for matching questions', function() {
//             question.setQuestionType(data.questionTypes.matching);
//             question.getRichContentToggle().should('not.exist');
//         });

//         it('should not appear for matrix questions', function() {
//             question.setQuestionType(data.questionTypes.matrix);
//             question.getRichContentToggle().should('not.exist');
//         });

//         it('should not appear for dropdown questions', function() {
//             question.setQuestionType(data.questionTypes.dropdowns);
//             question.getRichContentToggle().should('not.exist');
//         });

//         it('should not appear for textmatch questions', function() {
//             question.setQuestionType(data.questionTypes.textmatch);
//             question.getRichContentToggle().should('not.exist');
//         });

//         it('should not appear for numerical questions', function() {
//             question.setQuestionType(data.questionTypes.numerical);
//             question.getRichContentToggle().should('not.exist');
//         });
//     });
// });

// describe('Reordering questions', function() {
//     it('should not show a reorder up arrow if it is the first question', function() {
//         const question = editQcPage.getQuestion(0);
//         question.getReorderUpBtn().should('not.exist');
//     });

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
// });

// describe('Navigating away from editing a quick check without saving', function() {
//     it('should display a confirm message', function () {
//         editQcPage.goBack();
//         common.acceptAlert();
//     });
// });