var includes = require('../common/includes.js'),
    allQuestionTypesData = new includes.AllQuestionTypesData(),
    common = new includes.Common(browser),
    data = includes.data,
    editQcPage = new includes.EditQcPage(browser),
    homePage = new includes.HomePage(browser),
    setPage = new includes.SetPage(browser);

describe('Adding a question', function() {
    it('should label the question as question #1', function() {
        editQcPage.addQuestion(data.questionTypes.mc);
        expect(editQcPage.getQuestion(0).getHeaderText()).toBe('question #1');
    });
});

describe('Adding a multiple choice question', function() {
    var question,
        questionData;

    beforeEach(function() {
        question = editQcPage.getQuestion(0);
        questionData = data.quizData.quiz1.question1;
    });

    it('should accept question text', function() {
        var questionText = data.quizData.quiz1.question1.questionText;

        common.enterTinyMceIframeInElement(question.question);
        common.enterTinyMceText(questionText);
        expect(common.getTinyMceText()).toBe(questionText);
        common.leaveTinyMceIframe();
        common.switchToLtiTool();
        common.enterAngularPage();
    });

    it('should default to randomizing answer option order', function() {
        expect(question.isRandomized()).toBeTruthy();
    });

    it('should allow unchecking the box for randomizing answer option order', function() {
        question.toggleRandomized();
        expect(question.isRandomized()).toBeFalsy();
        question.toggleRandomized(); //reset so this one is randomized
    });

    it('should throw a validation error if an option does not contain text', function() {
        editQcPage.save();
        expect(editQcPage.getSaveSuccess().isPresent()).toBe(false);
    });

    it('should throw a validation error if no correct answer is specified when trying to save', function() {
        //add all option text to remove that validation error, but don't select a correct answer
        var options = question.getOptions();
        question.enterMcTextOption(options.get(0), questionData.option1);
        question.enterMcTextOption(options.get(1), questionData.option2);
        question.enterMcTextOption(options.get(2), questionData.option3);
        question.enterMcTextOption(options.get(3), questionData.option4);
        editQcPage.save();
        expect(editQcPage.getSaveError().getText()).toContain(data.validateNoCorrectMessage);
    });

    it('should allow an option to be marked as correct', function() {
        var option = question.getOptions().get(0);
        question.toggleMcOptionCorrect(option);
        expect(question.isMcOptionMarkedCorrect(option)).toBe(true);
    });

    it('should default to only one answer being allowed as correct', function() {
        var options = question.getOptions(),
            option1 = options.get(0),
            option2 = options.get(1);

        question.toggleMcOptionCorrect(option2);
        expect(question.isMcOptionMarkedCorrect(option2)).toBe(true);
        expect(question.isMcOptionMarkedCorrect(option1)).toBe(false);
    });

    it('should allow adding a question option', function() {
        question.addMcOption();
        expect(question.getOptions().count()).toBe(5);
    });

    it('should allow removing a question option', function() {
        var lastOption = question.getOptions().get(4);
        question.deleteOption(lastOption);
        expect(question.getOptions().count()).toBe(4);
    });

    it('should show an option for per-response feedback', function() {
        question.feedback.addCustomFeedback();
        expect(question.feedback.getPerResponseFeedbackCheckbox().isDisplayed()).toBe(true);
    });

    it('should hide question-level feedback when per-response feedback is selected', function() {
        question.feedback.togglePerResponseFeedback();
        expect(question.feedback.getQuestionLevelFeedbackContainer().isPresent()).toBe(false);
    });

    it('should show question-level feedback again if per-response feedback is un-selected', function() {
        question.feedback.togglePerResponseFeedback();
        expect(question.feedback.getQuestionLevelFeedbackContainer().isPresent()).toBe(true);
    });

    it('should show each of the options when per-response feedback is added', function() {
        question.feedback.togglePerResponseFeedback();
        expect(question.feedback.getPerResponseFeedbackOptions().count()).toBe(4);
    });

    it('should show which option is correct in the per-response feedback options', function() {
        var feedbackOptions = question.feedback.getPerResponseFeedbackOptions();
        expect(question.feedback.isFeedbackOptionMarkedCorrect(feedbackOptions.get(0))).toBe(false);
        expect(question.feedback.isFeedbackOptionMarkedCorrect(feedbackOptions.get(1))).toBe(true);
        expect(question.feedback.isFeedbackOptionMarkedCorrect(feedbackOptions.get(2))).toBe(false);
        expect(question.feedback.isFeedbackOptionMarkedCorrect(feedbackOptions.get(3))).toBe(false);
    });

    it('should throw a validation error if one of the per-response feedback inputs is left blank', function() {
        var feedbackOptions = question.feedback.getPerResponseFeedbackOptions();
        question.feedback.enterResponseFeedback(feedbackOptions.get(0), questionData.feedbackOption1);
        question.feedback.enterResponseFeedback(feedbackOptions.get(1), questionData.feedbackOption2);
        question.feedback.enterResponseFeedback(feedbackOptions.get(2), questionData.feedbackOption3);
        //leave last feedback input blank
        editQcPage.save();
        expect(editQcPage.getSaveError().isDisplayed()).toBe(true);
        //now fill in the last feedback input; also add the next question, so the next test can fetch it without problems
        question.feedback.enterResponseFeedback(feedbackOptions.get(3), questionData.feedbackOption4);
        editQcPage.addQuestion(data.questionTypes.mcorrect);
    });
    //NOTE: not testing for allowing multiple correct answers in multiple choice, because that feature will most
    //likely fall under the umbrella of creating survey questions in the future
});

describe('Adding a multiple correct question', function() {
    var question,
        questionData;

    beforeEach(function() {
        question = editQcPage.getQuestion(1);
        questionData = data.quizData.quiz1.question2;
    });

    it('should label the question as question #2', function() {
        expect(question.getHeaderText()).toBe('question #2');
    });

    it('should default to randomizing answer option order', function() {
        expect(question.isRandomized()).toBeTruthy();
        question.toggleRandomized(); //unrandomize so we can easily grab proper inputs in student view
    });

    it('should allow adding a question option', function() {
        question.addMcOption();
        expect(question.getOptions().count()).toBe(5);
    });

    it('should allow removing a question option', function() {
        question.deleteOption(question.getOptions().get(0));
        expect(question.getOptions().count()).toBe(4);
    });

    it('should throw a validation error if an option does not contain text', function() {
        editQcPage.save();
        expect(editQcPage.getSaveError().isDisplayed()).toBe(true);
    });

    it('should throw a validation error if no correct answer is specified when trying to save', function() {
        //fill in the 4 options
        var options = question.getOptions();
        question.enterMcTextOption(options.get(0), questionData.option1);
        question.enterMcTextOption(options.get(1), questionData.option2);
        question.enterMcTextOption(options.get(2), questionData.option3);
        question.enterMcTextOption(options.get(3), questionData.option4);
        editQcPage.save();
        expect(editQcPage.getSaveError().getText()).toContain(data.validateNoCorrectMessage);
    });

    it('should allow marking multiple options as correct', function() {
        var options = question.getOptions();
        question.toggleMcOptionCorrect(options.get(0));
        question.toggleMcOptionCorrect(options.get(1));
        expect(question.isMcOptionMarkedCorrect(options.get(0))).toBe(true);
        expect(question.isMcOptionMarkedCorrect(options.get(1))).toBe(true);
    });

    it('should allow toggling a correct answer to incorrect', function() {
        var option = question.getOptions().get(1);
        question.toggleMcOptionCorrect(option);
        expect(question.isMcOptionMarkedCorrect(option)).toBe(false);
    });

    it('should allow toggling an incorrect answer to correct', function() {
        var option = question.getOptions().get(1);
        question.toggleMcOptionCorrect(option);
        expect(question.isMcOptionMarkedCorrect(option)).toBe(true);
    });

    it('should show an option for per-response feedback', function() {
        question.feedback.addCustomFeedback();
        expect(question.feedback.getPerResponseFeedbackCheckbox().isDisplayed()).toBe(true);
    });

    it('should show each of the options when per-response feedback is added', function() {
        question.feedback.togglePerResponseFeedback();
        expect(question.feedback.getPerResponseFeedbackOptions().count()).toBe(4);
    });

    it('should show an indication of correctness when per-response feedback is added', function() {
        var feedbackOptions = question.feedback.getPerResponseFeedbackOptions();
        expect(question.feedback.isFeedbackOptionMarkedCorrect(feedbackOptions.get(0))).toBe(true);
        expect(question.feedback.isFeedbackOptionMarkedCorrect(feedbackOptions.get(1))).toBe(true);
        expect(question.feedback.isFeedbackOptionMarkedCorrect(feedbackOptions.get(2))).toBe(false);
        expect(question.feedback.isFeedbackOptionMarkedCorrect(feedbackOptions.get(3))).toBe(false);
        //enter in feedback for these guys
        question.feedback.enterResponseFeedback(feedbackOptions.get(0), questionData.feedbackOption1);
        question.feedback.enterResponseFeedback(feedbackOptions.get(1), questionData.feedbackOption2);
        question.feedback.enterResponseFeedback(feedbackOptions.get(2), questionData.feedbackOption3);
        question.feedback.enterResponseFeedback(feedbackOptions.get(3), questionData.feedbackOption4);
        editQcPage.addQuestion(data.questionTypes.matrix);
    });
});


describe('Adding a matrix question', function() {
    var question,
        questionData;

    beforeEach(function() {
        question = editQcPage.getQuestion(2);
        questionData = data.quizData.quiz1.question3;
    });

    it('should default to randomizing answer option order', function() {
        expect(question.isRandomized()).toBeTruthy();
        question.toggleRandomized(); //unrandomize so we can easily grab proper inputs in student view
    });

    it('should allow adding columns', function() {
        question.addMatrixColumn();
        question.addMatrixColumn();
        expect(question.getMatrixColumns().count()).toBe(2);
    });

    it('should allow deleting columns', function() {
        question.deleteOption(question.getMatrixColumns().get(1));
        expect(question.getMatrixColumns().count()).toBe(1);
    });

    it('should allow adding rows', function() {
        question.addMatrixRow();
        question.addMatrixRow();
        expect(question.getMatrixRows().count()).toBe(2);
    });

    it('should show the appropriate number of text inputs', function() {
        expect(question.getMatrixTextInputs().count()).toBe(3);
    });

    it('should show the appropriate number of checkboxes', function() {
        expect(question.getMatrixCheckboxes().count()).toBe(2);
    });

    it('should allow deleting rows', function() {
        question.deleteOption(question.getMatrixRows().get(1));
        expect(question.getMatrixRows().count()).toBe(1);
    });

    it('should throw a validation error if the labels are not filled in for rows and columns', function() {
        editQcPage.save();
        expect(editQcPage.getSaveSuccess().isPresent()).toBe(false);
    });

    it('should throw a validation error if a correct answer isn\'t marked', function() {
        //fill in all of the options now
        var textInputs;
        question.addMatrixRow();
        question.addMatrixColumn();
        textInputs = question.getMatrixTextInputs();
        textInputs.get(0).sendKeys(questionData.column1);
        textInputs.get(1).sendKeys(questionData.column2);
        textInputs.get(2).sendKeys(questionData.row1);
        textInputs.get(3).sendKeys(questionData.row2);

        editQcPage.save();
        expect(editQcPage.getSaveError().getText()).toContain(data.validateNoCorrectMessage);
    });

    it('should allow checking an answer', function() {
        var checkboxes = question.getMatrixCheckboxes();
        checkboxes.get(0).click();
        expect(checkboxes.get(0).getAttribute('checked')).toBeTruthy();
    });

    it('should only allow one answer per row', function() {
        var checkboxes = question.getMatrixCheckboxes();
        checkboxes.get(1).click();
        expect(checkboxes.get(0).getAttribute('checked')).toBeFalsy();
        expect(checkboxes.get(1).getAttribute('checked')).toBeTruthy();

        //now add in the actual answers
        checkboxes.get(0).click();
        checkboxes.get(3).click();
    });

    it('should not show an option for per-response feedback', function() {
        question.feedback.addCustomFeedback();
        expect(question.feedback.getPerResponseFeedbackCheckbox().isPresent()).toBe(false);
        //enter in feedback
        question.feedback.getCorrectFeedback().sendKeys(questionData.feedbackCorrect);
        question.feedback.getIncorrectFeedback().sendKeys(questionData.feedbackIncorrect);
        //prep for next text
        editQcPage.addQuestion(data.questionTypes.matching);
    });
});


describe('Adding a matching question', function() {
    var question,
        questionData;

    beforeEach(function() {
        question = editQcPage.getQuestion(3);
        questionData = data.quizData.quiz1.question4;
    });

    it('should default to randomizing answer option order', function() {
        expect(question.isRandomized()).toBeTruthy();
        question.toggleRandomized(); //unrandomize so we can easily grab proper inputs in student view
    });

    it('should allow adding matching pairs', function() {
        question.addMatchingPair();
        expect(question.getMatchingPrompts().count()).toBe(1);
    });

    it('should throw a validation error if a matching pair field isn\'t filled', function() {
        editQcPage.save();
        expect(editQcPage.getSaveSuccess().isPresent()).toBe(false);
    });

    it('should allow deleting matching pairs', function() {
        var optionToDelete;
        //Add in another row, then fill in all of the new text inputs to make it valid
        question.addMatchingPair();
        question.getMatchingPairInputs().then(function(textInputs) {
            textInputs[0].sendKeys(questionData.prompt1);
            textInputs[1].sendKeys(questionData.answer1);
            textInputs[2].sendKeys(questionData.prompt2);
            textInputs[3].sendKeys(questionData.answer2);
        });

        //add a third row, then delete it
        question.addMatchingPair();
        optionToDelete = question.getMatchingPrompts().get(2);
        question.deleteOption(optionToDelete);
        expect(question.getMatchingPrompts().count()).toBe(2);
    });

    it('should allow adding distractors', function() {
        question.addDistractor();
        expect(question.getDistractors().count()).toBe(1);
    });

    it('should throw a validation error if a distractor field isn\'t filled', function() {
        question.getDistractors().then(function(distractors) {
            question.enterDistractor(distractors[0], questionData.distractor);
            question.addDistractor();
            editQcPage.save();
            expect(editQcPage.getSaveSuccess().isPresent()).toBe(false);
        });
    });

    it('should allow deleting distractors', function() {
        question.getDistractors().then(function(distractors) {
            question.deleteOption(question.getDistractors().get(1));
            expect(question.getDistractors().count()).toBe(1);
        });
    });

    it('should not show an option for per-response feedback', function() {
        //NOTE: adding custom feedback to this question so we can test that it gets deleted later when we edit
        question.feedback.addCustomFeedback();
        question.feedback.getCorrectFeedback().sendKeys('Does not matter');
        question.feedback.getIncorrectFeedback().sendKeys('Also does not matter');
        expect(question.feedback.getPerResponseFeedbackCheckbox().isPresent()).toBe(false);
        //set up for next test
        editQcPage.addQuestion(data.questionTypes.dropdowns);
    });
});

describe('Adding a multiple dropdowns question', function() {
    var question,
        questionData;

    beforeEach(function() {
        question = editQcPage.getQuestion(4);
        questionData = data.quizData.quiz1.question5;
    });

    it('should not feature a randomize options checkbox', function() {
        //should be no randomizing checkbox for multiple dropdowns, since order matters
        expect(question.getRandomizedCheckbox().isPresent()).toBe(false);
    });

    it('should allow adding dropdown pairs', function() {
        question.addDropdownPair();
        expect(question.getDropdownPrompts().count()).toBe(1);
    });

    it('should throw a validation error if a dropdown pair field isn\'t filled', function() {
        editQcPage.save();
        expect(editQcPage.getSaveSuccess().isPresent()).toBe(false);
    });

    it('should allow deleting dropdown pairs', function() {
        //add in the valid data
        question.addDropdownPair();
        question.getDropdownTextInputs().then(function(textInputs) {
            textInputs[0].sendKeys(questionData.prompt1);
            textInputs[1].sendKeys(questionData.answer1);
            textInputs[2].sendKeys(questionData.prompt2);
            textInputs[3].sendKeys(questionData.answer2);
        });

        question.addDropdownPair();
        question.deleteOption(question.getDropdownPrompts().get(2));
        expect(question.getDropdownPrompts().count()).toBe(2);
    });

    it('should allow adding distractors', function() {
        question.addDistractor();
        expect(question.getDistractors().count()).toBe(1);
    });

    it('should throw a validation error if a distractor field isn\'t filled', function() {
        editQcPage.save();
        expect(editQcPage.getSaveSuccess().isPresent()).toBe(false);
    });

    it('should allow deleting distractors', function() {
        question.getDistractors().then(function(distractors) {
            //fill in text for the first distractor
            question.enterDistractor(distractors[0], questionData.distractor);
            question.addDistractor();
            question.deleteOption(question.getDistractors().get(1));
            expect(question.getDistractors().count()).toBe(1);
        });
    });

    it('should not show an option for per-response feedback', function() {
        question.feedback.addCustomFeedback();
        expect(question.feedback.getPerResponseFeedbackCheckbox().isPresent()).toBe(false);
        question.feedback.deleteFeedback();
        //set up for next test
        editQcPage.addQuestion(data.questionTypes.textmatch);
    });
});


describe('Adding a textmatch question', function() {
    var question,
        questionData;

    beforeEach(function() {
        question = editQcPage.getQuestion(5);
        questionData = data.quizData.quiz1.question6;
    });

    it('should not feature a randomize options checkbox', function() {
        //should be no randomizing checkbox for textmatch, since there is nothing to randomize
        expect(question.getRandomizedCheckbox().isPresent()).toBe(false);
    });

    it('should allow adding a possible answer', function() {
        question.addTextmatchAnswer();
        expect(question.getOptions().count()).toBe(1);
    });

    it('should throw a validation error if the textmatch answer field isn\'t filled', function() {
        editQcPage.save();
        expect(editQcPage.getSaveSuccess().isPresent()).toBe(false);
    });

    it('should allow deleting a possible answer', function() {
        question.addTextmatchAnswer();
        question.deleteOption(question.getOptions().get(1));
        expect(question.getOptions().count()).toBe(1);
    });

    it('should not show an option for per-response feedback', function() {
        //while we're here, add in the actual answer
        question.enterTextMatchOption(question.getOptions().get(0), questionData.option1);

        question.feedback.addCustomFeedback();
        expect(question.feedback.getPerResponseFeedbackCheckbox().isPresent()).toBe(false);
        question.feedback.deleteFeedback();
        //set up for next test
        editQcPage.addQuestion(data.questionTypes.numerical);
    });
});


describe('Adding a numerical question', function() {
    var question,
        questionData;

    beforeEach(function() {
        question = editQcPage.getQuestion(6);
        questionData = data.quizData.quiz1.question7;
    });

    it('should not feature a randomize options checkbox', function() {
        expect(question.getRandomizedCheckbox().isPresent()).toBe(false);
    });

    it('should allow adding a possible answer', function() {
        question.addNumericalAnswer();
        expect(question.getOptions().count()).toBe(1);
    });

    it('should throw a validation error if the numeric answer field isn\'t filled', function() {
        editQcPage.save();
        expect(editQcPage.getSaveSuccess().isPresent()).toBe(false);
    });

    it('should show exact answer and margin of error as the default', function() {
        var option;

        question.addNumericalAnswer();
        option = question.getOptions().get(1);
        expect(question.getExactAnswerInput(option).isDisplayed()).toBe(true);
        expect(question.getMarginOfErrorInput(option).isDisplayed()).toBe(true);
        expect(question.getRangeMinInput(option).isPresent()).toBe(false);
        expect(question.getRangeMaxInput(option).isPresent()).toBe(false);
    });

    it('should show the range options when answer type is changed', function() {
        var option = question.getOptions().get(1);
        question.setOptionAsRange(option);
        expect(question.getExactAnswerInput(option).isPresent()).toBe(false);
        expect(question.getMarginOfErrorInput(option).isPresent()).toBe(false);
        expect(question.getRangeMinInput(option).isDisplayed()).toBe(true);
        expect(question.getRangeMaxInput(option).isDisplayed()).toBe(true);
    });

    it('should allow deleting a possible answer', function() {
        question.deleteOption(question.getOptions().get(1));
        expect(question.getOptions().count()).toBe(1);
    });

    it('should not show an option for per-response feedback', function() {
        question.feedback.addCustomFeedback();
        expect(question.feedback.getPerResponseFeedbackCheckbox().isPresent()).toBe(false);
        question.feedback.deleteFeedback();
    });

    it('should accept an exact numerical answer', function() {
        var option = question.getOptions().get(0);
        question.enterNumericalExactOption(option, questionData.option1, '0');
    })
});

describe('Saving an assessment', function() {
    it('should show a success message if there are no errors', function() {
        editQcPage.save();
        expect(editQcPage.getSaveSuccess().isDisplayed()).toBe(true);
    });

    it('should allow deleting previously saved custom feedback', function() {
        editQcPage.getQuestion(3).feedback.deleteFeedback();
        editQcPage.save();
        expect(editQcPage.getQuestion(3).feedback.getFeedbackPanel().isPresent()).toBe(false);
    });
});

//OK, this isn't really a test. Just setting up for a later test, and nowhere else to put it.
describe('Adding another subset for testing purposes to later move the quick check', function() {
    var assessmentName,
        set,
        subset,
        subsetName,
        quickcheck;

    beforeEach(function() {
        set = data.sets.featuresAllOn;
        subsetName = set.subsets.group2;
        assessmentName = set.quickchecks.featuresAllOn;
    });

    it('should not raise a fuss', function() {
        var subset,
            quickcheck;

        editQcPage.goBackToSet();
        setPage.addSubset();
        setPage.getNewSubsetInput().sendKeys(subsetName);
        setPage.saveNewSubset().then(function() {
            subset = setPage.getSubset(0);
            quickcheck = subset.getQuickChecks().get(0);
            subset.editQuickCheck(quickcheck);
        });
    });
});

describe('Editing a previously saved assessment should show the correct information', function() {
    allQuestionTypesData.verify(editQcPage, data);
});

describe('Changing the subset a quick check belongs to', function() {
    var formerSubsetName,
        newSubsetName;

    beforeEach(function() {
        formerSubsetName = data.sets.featuresAllOn.subsets.group1;
        newSubsetName = data.sets.featuresAllOn.subsets.group2;
    });

    it('should show all subsets available in the dropdown', function() {
        expect(editQcPage.getSubsetOptions().get(0).getText()).toBe(formerSubsetName);
        expect(editQcPage.getSubsetOptions().get(1).getText()).toBe(newSubsetName);
        editQcPage.getSubsetSelect().sendKeys(newSubsetName);
    });

    it('should keep the integrity of the data after saving', function() {
        editQcPage.save();
        expect(editQcPage.getCurrentSubset()).toBe(newSubsetName);
     });

    it('should show this quickcheck in the subset it was moved to on the set page', function() {
        var subset,
            quickchecks;

        editQcPage.goBack();
        subset = setPage.getSubset(1);
        quickchecks = subset.getQuickChecks();
        expect(quickchecks.count()).toBe(1);
    });
});


//not explicitly testing these, since we tested the first one, but we do need to add a few other assessments for full coverage
describe('Adding the rest of the quick checks for testing purposes', function() {
    //First...2 sets, one has features all on, other has features all off; 4 quick checks total, for better coverage:
    //embed the 4 quick checks:
    //1) from set where features are all on (all question types),
    //2) to be embedded as external url (include 1 matrix and 1 matching question so we can test partial credit),
    //3) from set where features are all off (and with due date set in past, 1 multiple choice question),
    //4) where results aren't released (and no due date, 1 multiple choice question)
    var qc2Name,
        qc3Name,
        qc4Name,
        set,
        setName,
        subsetName;


    beforeEach(function() {
        set = data.sets.featuresAllOff;
        setName = set.name,
        subsetName = set.subsets.group1,
        qc2Name = set.quickchecks.urlEmbed,
        qc3Name = set.quickchecks.featuresAllOffPastDue,
        qc4Name = set.quickchecks.resultsNotReleased;
    });

    it('should add a new set/subset and quick check #2 without any fuss', function() {
        var currentQuestion,
            i = 0,
            quizData = data.quizData.quiz2;

        //for this set, where all features are on, toggle the one that is off
        setPage.openFeaturesAccordion();
        setPage.featurePanel.toggleFeatureByIndex(1);
        setPage.nav.goToHome();

        //add new set and subset from home page
        homePage.addQuickCheck();
        homePage.selectNewSet();
        homePage.getNewSetInput().sendKeys(setName);
        homePage.selectNewSubset();
        homePage.getNewSubsetInput().sendKeys(subsetName);
        homePage.saveNewQuickCheck(qc2Name);

        //set title and description so we can test later that it appears
        editQcPage.initQuestions();
        //editQcPage = new includes.EditQcPage(browser);
        editQcPage.getTitleInput().sendKeys(qc2Name);
        editQcPage.getDescriptionInput().sendKeys('Description');

        //add matrix question
        editQcPage.addQuestion(data.questionTypes.matrix);
        currentQuestion = editQcPage.getQuestion(0);
        currentQuestion.toggleRandomized(); //note: toggling all of these as un-randomized so it's easier to test
        for(i = 0; i < 2; i++) {
            currentQuestion.addMatrixRow();
            currentQuestion.addMatrixColumn();
        }
        currentQuestion.getMatrixTextInputs().get(0).sendKeys(quizData.question1.column1);
        currentQuestion.getMatrixTextInputs().get(1).sendKeys(quizData.question1.column2);
        currentQuestion.getMatrixTextInputs().get(2).sendKeys(quizData.question1.row1);
        currentQuestion.getMatrixTextInputs().get(3).sendKeys(quizData.question1.row2);
        currentQuestion.getMatrixCheckboxes().get(1).click();
        currentQuestion.getMatrixCheckboxes().get(2).click();

        //add matching question, then save
        editQcPage.addQuestion(data.questionTypes.matching);
        currentQuestion = editQcPage.getQuestion(1);
        currentQuestion.toggleRandomized();
        for(i = 0; i < 2; i++) {
            currentQuestion.addMatchingPair();
        }
        currentQuestion.getMatchingPairInputs().get(0).sendKeys(quizData.question2.prompt1);
        currentQuestion.getMatchingPairInputs().get(1).sendKeys(quizData.question2.answer1);
        currentQuestion.getMatchingPairInputs().get(2).sendKeys(quizData.question2.prompt2);
        currentQuestion.getMatchingPairInputs().get(3).sendKeys(quizData.question2.answer2);

        editQcPage.save();
        //had to click the link at the bottom because the one at the top was unclickable for some
        //reason, even though it wasn't before...gotta love Protractor! -he says as he rips his hair out
        editQcPage.goBackToSet();
    });

    it('should successfully add quick check #3 to an existing set/subset from the home page', function() {
        var correctOption,
            currentQuestion,
            option1,
            option2,
            option3,
            questionData = data.quizData.quiz3.question1,
            subset;

        //go back to home page to add the quick check
        setPage.nav.goToHome();
        homePage.addQuickCheck();
        homePage.selectSet(setName);
        homePage.selectSubset(subsetName);
        homePage.saveNewQuickCheck(qc3Name);

        editQcPage.initQuestions();
        editQcPage.addQuestion(data.questionTypes.numerical);
        currentQuestion = editQcPage.getQuestion(0);

        //3 options:
        //1. exact answer with 0 as margin of error; note that the answer itself is 0 in this case,
        //so we can also ensure that 0 is accepted as an answer (previous bug fix)
        currentQuestion.addNumericalAnswer();
        option1 = currentQuestion.getOptions().get(0);
        currentQuestion.enterNumericalExactOption(option1, questionData.option1.exact, questionData.option1.margin);

        //2. exact answer with margin of error
        currentQuestion.addNumericalAnswer();
        option2 = currentQuestion.getOptions().get(1);
        currentQuestion.enterNumericalExactOption(option2, questionData.option2.exact, questionData.option2.margin);

        //3. range answer
        currentQuestion.addNumericalAnswer();
        option3 = currentQuestion.getOptions().get(2);
        currentQuestion.setOptionAsRange(option3);
        currentQuestion.enterNumericalRangeOption(option3, questionData.option3.rangeMin, questionData.option3.rangeMax);

        //save, go back to set page, and double check that the subset and quick check were properly added
        editQcPage.save();
        editQcPage.goBackToSet();
        setPage.initSubsets().then(function() {
            subset = setPage.getSubset(0);
            expect(subset.getName()).toBe(subsetName.toUpperCase());
            expect(subset.getQuickChecks().count()).toBe(2);
        });
    });

    it('should successfully add quick check #4', function() {
        var correctOption,
            currentQuestion,
            option1,
            option2,
            option3,
            option4,
            questionData = data.quizData.quiz4.question1,
            set,
            subset = setPage.getSubset(0);

        //while we're here, turn all features off for this set
        setPage.openFeaturesAccordion();
        setPage.featurePanel.toggleFeatureByIndex(0);
        setPage.featurePanel.toggleFeatureByIndex(2);

        //add the last quick check and edit it
        subset.addAndSaveQuickCheck(qc4Name);
        subset.editQuickCheck(subset.getQuickChecks().last());

        //add a single multiple choice question and save
        editQcPage.initQuestions();
        editQcPage.addQuestion(data.questionTypes.mc);
        currentQuestion = editQcPage.getQuestion(0);
        currentQuestion.toggleRandomized();
        option1 = currentQuestion.getOptions().get(0);
        option2 = currentQuestion.getOptions().get(1);
        option3 = currentQuestion.getOptions().get(2);
        option4 = currentQuestion.getOptions().get(3);
        correctOption = currentQuestion.getOptions().get(questionData.answerIndex);

        currentQuestion.enterMcTextOption(option1, questionData.option1);
        currentQuestion.enterMcTextOption(option2, questionData.option2);
        currentQuestion.enterMcTextOption(option3, questionData.option3);
        currentQuestion.enterMcTextOption(option4, questionData.option4);
        currentQuestion.toggleMcOptionCorrect(correctOption);
        editQcPage.save();

        editQcPage.goBackToSet();
    });
});