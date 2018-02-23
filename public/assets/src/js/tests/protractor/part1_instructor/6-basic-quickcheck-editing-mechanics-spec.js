var includes = require('../common/includes.js'),
    common = new includes.Common(browser),
    data = includes.data,
    editQcPage = new includes.EditQcPage(browser),
    sets = includes.data.sets,
    setPage = new includes.SetPage(browser);

describe('Editing an assessment', function () {
    it('should show the correct assessment name', function () {
        var subset,
            quickcheck;

        setPage.initSubsets().then(function() {
            subset = setPage.getSubset(0);
            quickcheck = subset.getQuickChecks().get(0);
            subset.editQuickCheck(quickcheck);
            expect(editQcPage.getAssessmentName()).toBe(sets.toBeDeleted.quickchecks.test);
        });
    });

    it('should show the correct assessment group', function () {
        var select = editQcPage.getSubsetSelect();
        expect(common.getSelectedText(select)).toBe(sets.toBeDeleted.subsets.group1);
    });

    it('should automatically add a multiple choice question with 4 options when adding a question', function() {
        var question,
            questionTypeDropdown,
            questionType;

        editQcPage.addQuestion();
        questionTypeDropdown = editQcPage.questions[0].getQuestionTypeDropdown();
        questionType = common.getSelectedText(questionTypeDropdown);
        expect(questionType).toBe(data.questionTypes.mc);
    });

    it('should not show reordering icons if there is only a single question', function() {
        var question = editQcPage.questions[0];
        expect(question.getReorderUpBtn().isPresent()).toBe(false);
        expect(question.getReorderDownBtn().isPresent()).toBe(false);
    });
});

describe('Adding feedback to a question', function() {
    var question;

    beforeEach(function() {
        question = editQcPage.getQuestion(0);
    });

    it('should show the custom feedback panel when the button is clicked', function() {
        var feedbackPanel;
        question.feedback.addCustomFeedback();
        feedbackPanel = question.feedback.getFeedbackPanel();
        expect(feedbackPanel.isDisplayed()).toBe(true);
    });

    it('should show feedback for correct options', function() {
        expect(question.feedback.getCorrectFeedback().isDisplayed()).toBe(true);
    });

    it('should show feedback for incorrect options', function() {
        expect(question.feedback.getIncorrectFeedback().isDisplayed()).toBe(true);
    });

    it('should remove the custom feedback panel when the delete button is clicked', function() {
        question.feedback.deleteFeedback();
        expect(question.feedback.getFeedbackPanel().isPresent()).toBe(false);
    });
});

describe('Deleting a question', function() {
    var question;

    beforeEach(function() {
        question = editQcPage.getQuestion(0);
    });

    //deleting a question also creates a confirm js alert, so run this test while we are in a new tab instead of in iframe
    it('should remove the question when the delete question button is clicked', function() {
        question.deleteQuestion();
        expect(editQcPage.getQuestions().count()).toBe(0);
    });

    it('should label the question as question #1 after the first question was deleted', function() {
        var newQuestion;

        editQcPage.addQuestion(data.questionTypes.mc);
        newQuestion = editQcPage.getQuestions().get(0);
        expect(newQuestion.getText()).toContain('question #1');
        //re-initialize page questions for next round of tests since one was deleted
        editQcPage.initQuestions();
    });
});

describe('Using the rich content editor toggle', function() {
    var option,
        question,
        submittedText = 'Test content, will be deleted.';

    describe('in a multiple choice question', function() {
        beforeEach(function() {
            question = editQcPage.getQuestion(0);
            option = question.getOptions().get(0);
        });

        it('should show a toggle', function() {
            expect(question.getRichContentToggle().isDisplayed()).toBe(true);
        });

        it('should show a rich content editor when toggle is enabled', function() {
            //add a bit of content first so we can see if it remains
            question.enterMcTextOption(option, submittedText);

            question.toggleRichContent();
            expect(common.getTinyMceIframeFromElement(option).isDisplayed()).toBe(true);
        });

        it('should remove the basic input element when toggle is enabled', function() {
            expect(question.getOptionInput(option).isPresent()).toBe(false);
        });

        it('should retain existing information when toggle is enabled', function() {
            common.enterTinyMceIframeInElement(option);
            expect(common.getTinyMceText(option)).toBe(submittedText);
            common.leaveTinyMceIframe();
            common.enterAngularPage();
        });

        it('should remove the rich content editor when toggle is disabled', function() {
            question.toggleRichContent();
            expect(common.getTinyMceIframeFromElement(option).isPresent()).toBe(false);
        });

        it('should show the basic input element when the toggle is disabled', function() {
            expect(question.getOptionInput(option).isDisplayed()).toBe(true);
        });

        it('should retain existing information when the toggle is disabled', function() {
            expect(question.getMcOptionInputValue(option)).toBe(submittedText);
            //initialize for next round of tests
            editQcPage.addQuestion(data.questionTypes.mcorrect);
        });
    });

    describe('in a multiple correct question', function() {
        beforeEach(function() {
            question = editQcPage.getQuestion(1);
            option = question.getOptions().get(0);
        });

        it('should show a toggle', function() {
            expect(question.getRichContentToggle().isDisplayed()).toBe(true);
        });

        it('should show a rich content editor when toggle is enabled', function() {
            //add a bit of content first so we can see if it remains
            question.enterMcTextOption(option, submittedText);

            question.toggleRichContent();
            expect(common.getTinyMceIframeFromElement(option).isDisplayed()).toBe(true);
        });

        it('should remove the basic input element when toggle is enabled', function() {
            expect(question.getOptionInput(option).isPresent()).toBe(false);
        });

        it('should retain existing information when toggle is enabled', function() {
            common.enterTinyMceIframeInElement(option);
            expect(common.getTinyMceText(option)).toBe(submittedText);
            common.leaveTinyMceIframe();
            common.enterAngularPage();
        });

        it('should remove the rich content editor when toggle is disabled', function() {
            question.toggleRichContent();
            expect(common.getTinyMceIframeFromElement(option).isPresent()).toBe(false);
        });

        it('should show the basic input element when the toggle is disabled', function() {
            expect(question.getOptionInput(option).isDisplayed()).toBe(true);
        });

        it('should retain existing information when the toggle is disabled', function() {
            expect(question.getMcOptionInputValue(option)).toBe(submittedText);
        });
    });

    describe('in the feedback panel', function() {
        var correctFeedbackContainer,
            responseFeedbackOption;

        beforeEach(function() {
            question = editQcPage.getQuestion(1);
        });

        describe('for basic feedback', function() {
            it('should show a toggle', function() {
                question.feedback.addCustomFeedback();
                expect(question.feedback.getRichContentToggle().isDisplayed()).toBe(true);
            });

            it('should show a rich content editor when toggle is enabled', function() {
                correctFeedbackContainer = question.feedback.getCorrectFeedbackContainer();
                //add a bit of content first so we can see if it remains
                question.feedback.getCorrectFeedback().sendKeys(submittedText);
                question.feedback.toggleRichContent();
                expect(common.getTinyMceIframeFromElement(correctFeedbackContainer).isDisplayed()).toBe(true);
            });

            it('should retain existing information when toggle is enabled', function() {
                common.enterTinyMceIframeInElement(correctFeedbackContainer);
                expect(common.getTinyMceText(correctFeedbackContainer)).toBe(submittedText);
                common.leaveTinyMceIframe();
                common.enterAngularPage();
            });

            it('should remove the rich content editor when toggle is disabled', function() {
                question.feedback.toggleRichContent();
                expect(common.getTinyMceIframeFromElement(correctFeedbackContainer).isPresent()).toBe(false);
            });

            it('should show the basic input element when the toggle is disabled', function() {
                expect(question.feedback.getCorrectFeedback().isDisplayed()).toBe(true);
            });
        });

        describe('for per-option feedback', function() {
            it('should show a toggle', function() {
                question.feedback.togglePerResponseFeedback();
                expect(question.feedback.getRichContentToggle().isDisplayed()).toBe(true);
            });

            it('should show a rich content editor when toggle is enabled', function() {
                //add a bit of content first so we can see if it remains
                responseFeedbackOption = question.feedback.getPerResponseFeedbackOptions().get(0);
                question.feedback.enterResponseFeedback(responseFeedbackOption, submittedText);
                question.feedback.toggleRichContent();
                expect(common.getTinyMceIframeFromElement(responseFeedbackOption).isDisplayed()).toBe(true);
            });

            it('should retain existing information when toggle is enabled', function() {
                common.enterTinyMceIframeInElement(responseFeedbackOption);
                expect(common.getTinyMceText(responseFeedbackOption)).toBe(submittedText);
                common.leaveTinyMceIframe();
                common.enterAngularPage();
            });

            it('should remove the rich content editor when toggle is disabled', function() {
                question.feedback.toggleRichContent();
                expect(common.getTinyMceIframeFromElement(responseFeedbackOption).isPresent()).toBe(false);
            });

            it('should show the basic input element when the toggle is disabled', function() {
                expect(question.feedback.getPerResponseFeedbackInput(responseFeedbackOption).isDisplayed()).toBe(true);
            });
        });
    });

    describe('in other question types', function() {
        it('should not appear for matching questions', function() {
            question.setQuestionType(data.questionTypes.matching);
            expect(question.getRichContentToggle().isPresent()).toBe(false);
        });

        it('should not appear for matrix questions', function() {
            question.setQuestionType(data.questionTypes.matrix);
            expect(question.getRichContentToggle().isPresent()).toBe(false);
        });

        it('should not appear for dropdown questions', function() {
            question.setQuestionType(data.questionTypes.dropdowns);
            expect(question.getRichContentToggle().isPresent()).toBe(false);
        });

        it('should not appear for textmatch questions', function() {
            question.setQuestionType(data.questionTypes.textmatch);
            expect(question.getRichContentToggle().isPresent()).toBe(false);
        });

        it('should not appear for numerical questions', function() {
            question.setQuestionType(data.questionTypes.numerical);
            expect(question.getRichContentToggle().isPresent()).toBe(false);
        });
    });
});

describe('Reordering questions', function() {
    it('should not show a reorder up arrow if it is the first question', function() {
        var question = editQcPage.getQuestion(0);
        expect(question.getReorderUpBtn().isPresent()).toBe(false);
    });

    it('should not show a reorder down arrow if it is the last question', function() {
        var question = editQcPage.getQuestion(1);
        expect(question.getReorderDownBtn().isPresent()).toBe(false);
    });

    it('should move a question up if the reorder up arrow is clicked', function() {
        var question = editQcPage.getQuestion(1),
            movedQuestion;

        question.getReorderUpBtn().click();
        //re-init questions to make sure they're composed properly
        editQcPage.initQuestions().then(function() {
            movedQuestion = editQcPage.getQuestion(0);
            expect(movedQuestion.getQuestionType()).toBe(data.questionTypes.numerical);
        });
    });

    it('should show the appropriate question number when the up arrow is clicked', function() {
        expect(editQcPage.getQuestion(0).getHeaderText()).toBe('question #1');
    });

    it('should displace the previous question if the reorder up arrow is clicked', function() {
        expect(editQcPage.getQuestion(1).getQuestionType()).toBe(data.questionTypes.mc);
    });

    it('should show the appropriate question number for the displaced question below', function() {
        expect(editQcPage.getQuestion(1).getHeaderText()).toBe('question #2');
    });

    it('should move a question down if the reorder down arrow is clicked', function() {
        var question = editQcPage.getQuestion(0),
            movedQuestion;

        question.getReorderDownBtn().click();
        editQcPage.initQuestions().then(function() {
            movedQuestion = editQcPage.getQuestion(1);
            expect(movedQuestion.getQuestionType()).toBe(data.questionTypes.numerical);
        });
    });

    it('should show the appropriate question number when the down arrow is clicked', function() {
        expect(editQcPage.getQuestion(1).getHeaderText()).toBe('question #2');
    });

    it('should displace the previous question if the reorder down arrow is clicked', function() {
        expect(editQcPage.getQuestion(0).getQuestionType()).toBe(data.questionTypes.mc);
    });

    it('should show the appropriate question number for the displaced question above', function() {
        expect(editQcPage.getQuestion(0).getHeaderText()).toBe('question #1');
    });
});

describe('Navigating away from editing a quick check without saving', function() {
    it('should display a confirm message', function () {
        editQcPage.goBack();
        common.acceptAlert();
    });
});