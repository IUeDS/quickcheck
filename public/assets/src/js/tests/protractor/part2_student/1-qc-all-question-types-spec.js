browser.params.browser2 = browser.forkNewDriverInstance(); //fork new browser instance for student
var browser2 = browser.params.browser2, //define browser instance globally to share across files
    includes = require('../common/includes.js'),
    canvasAssignmentsPage = new includes.CanvasAssignmentsPage(browser2),
    canvasLoginPage = new includes.CanvasLoginPage(browser2),
    common = new includes.Common(browser2),
    creds = includes.userCreds,
    data = includes.data,
    qcPage = new includes.QcPage(browser2);

describe('Navigating to the quick check', function() {
    var qcName;

    beforeEach(function() {
        qcName = data.sets.featuresAllOn.quickchecks.featuresAllOn;
    });

    it('should log in to Canvas and find the assignment', function() {
        common.enterNonAngularPage();
        canvasLoginPage.login(creds.student.username, creds.student.password);
        canvasAssignmentsPage.goToAssignments();
        canvasAssignmentsPage.openAssignment(qcName);
    });

    it('should show the embedded quiz', function() {
        //navigate to page and refresh, to test feature functionality of hiding empty attempts;
        //also, save the order of the options in the first multiple choice question, so we can make
        //sure that questions are being randomized, by comparing 1st, 2nd, and 3rd attempts; a bit
        //worried that we'd get a false negative if the random order happened to coincide each attempt;
        //so by comparing across three different attempts, I'm hoping it will be an infinitesimal chance.
        //note that we have to refresh the Canvas page, if we refresh inside the iframe, then protractor
        //will refresh it AS the browser window and take us out of Canvas, rather than just refreshing the frame
        common.switchToLtiTool();
        common.enterAngularPage();
        common.saveOptionList(qcPage.getMcOptions());
        common.switchToCanvas().then(function() {
            browser2.refresh().then(function() {
                common.switchToLtiTool();
                common.enterAngularPage();
                common.saveOptionList(qcPage.getMcOptions());
            });
        });
    });
});

//get all questions wrong at first, to make sure they are marked as incorrect
describe('Taking a graded quickcheck and getting all questions incorrect', function() {
    var quizData = data.quizData.quiz1;

    it('should not show a title if it is not present', function() {
        expect(qcPage.getTitle().isPresent()).toBe(false);
    });

    it('should not show a description if it is not present', function() {
        expect(qcPage.getDescription().isPresent()).toBe(false);
    });

    it('should show the correct number of questions in the quiz', function() {
        expect(qcPage.getQuestionProgress()).toBe('question 1 out of 7');
    });

    it('should begin with a score of 0', function() {
        expect(qcPage.getScore()).toBe('0 / 7 questions correct');
    });

    describe('when on a multiple choice question', function() {
        var questionData = quizData.question1;

        it('should show the proper question text', function() {
            expect(qcPage.getQuestionText()).toBe(questionData.questionText);
        });

        it('should show the options correctly', function() {
            //it's a bit tricky to check the exact question text for each option when the order is randomized,
            //so things look a little gnarly below. have to run through each possible option to see if it is there.
            var options = qcPage.getMcOptions(),
                textOptions = [
                    questionData.option1,
                    questionData.option2,
                    questionData.option3,
                    questionData.option4
                ];
            options.each(function(option) {
                var optionFound = false;
                option.getText().then(function(text) {
                    textOptions.forEach(function(textOption) {
                        if (textOption == text) {
                            optionFound = true;
                        }
                    });
                    expect(optionFound).toBe(true);
                });
            });
        });

        it('should disable the submit button until a multiple choice answer is selected', function() {
            expect(qcPage.isSubmitBtnDisabled()).toBe(true);
        });

        it('should mark the multiple choice question as incorrect when answered incorrectly', function() {
            //since it's randomized, we have to be sure that we're not clicking the correct answer
            qcPage.selectIncorrectRandomMcOption(questionData.answer);
            qcPage.submit();
            expect(qcPage.isIncorrectModal()).toBe(true);
        });

        it('should show per-response incorrect feedback for a multiple choice question if supplied', function() {
            expect(qcPage.getPerResponseFeedback().count()).toBe(1);
            qcPage.clickContinue();
        });

        it('should not increment the score when the question was answered incorrectly', function() {
            expect(qcPage.getScore()).toBe('0 / 7 questions correct');
        });
    });

    describe('when on a multiple correct question', function() {
        var questionData = quizData.question2;

        it('should increment the question number after the first question', function() {
            expect(qcPage.getQuestionProgress()).toBe('question 2 out of 7');
        });

        it('should properly show the question and options', function() {
            expect(qcPage.getQuestionText()).toBe(''); //no question text here
            expect(qcPage.getMcOptions().count()).toBe(4);
        });

        it('should show the options in the order saved when the question is not randomized', function() {
            var options = qcPage.getMcOptions();
            expect(options.get(0).getText()).toBe(questionData.option1);
            expect(options.get(1).getText()).toBe(questionData.option2);
            expect(options.get(2).getText()).toBe(questionData.option3);
            expect(options.get(3).getText()).toBe(questionData.option4);
        });

        it('should disable the submit button until an answer is selected', function() {
            expect(qcPage.isSubmitBtnDisabled()).toBe(true);
        });

        it('should mark the question as incorrect when answered incorrectly', function() {
            qcPage.selectMcOptionByIndex(0);
            qcPage.submit();
            expect(qcPage.isIncorrectModal()).toBe(true);
        });

        it('should show per-response incorrect feedback if supplied', function() {
            var feedback = qcPage.getPerResponseFeedback();
            expect(feedback.count()).toBe(1);
            expect(feedback.get(0).getText()).toBe(questionData.feedbackOption1);
            qcPage.clickContinue();
        });
    });

    describe('when on a matrix question', function() {
        var questionData = quizData.question3;

        it('should properly show the question', function() {
            expect(qcPage.getQuestionText()).toBe(''); //no question text here
        });

        it('should properly show the column text', function() {
            var columnCells = qcPage.getMatrixColumnCells();
            expect(columnCells.get(1).getText()).toBe(questionData.column1);
            expect(columnCells.get(2).getText()).toBe(questionData.column2);
        });

        it('should properly show the row text', function() {
            var rowCells = qcPage.getMatrixRowCells();
            expect(rowCells.get(0).getText()).toBe(questionData.row1);
            expect(rowCells.get(1).getText()).toBe(questionData.row2);
        });

        it('should have the correct number of checkboxes', function() {
            var checkboxes = qcPage.getMatrixCheckboxes();
            expect(checkboxes.count()).toBe(4);
        });

        it('should disable the submit button until all answers are selected', function() {
            expect(qcPage.isSubmitBtnDisabled()).toBe(true);
        });

        it('should only allow one selection per row', function() {
            var checkboxes = qcPage.getMatrixCheckboxes();
            qcPage.selectMatrixCheckboxByIndex(0);
            expect(checkboxes.get(0).getAttribute('checked')).toBeTruthy();
            expect(checkboxes.get(1).getAttribute('checked')).toBeFalsy();
            qcPage.selectMatrixCheckboxByIndex(1);
            expect(checkboxes.get(0).getAttribute('checked')).toBeFalsy();
            expect(checkboxes.get(1).getAttribute('checked')).toBeTruthy();
            qcPage.selectMatrixCheckboxByIndex(2);
        });

        it('should show incorrect feedback', function() {
            qcPage.submit();
            expect(qcPage.isIncorrectRowFeedback()).toBe(true);
        });

        it('should show incorrect rows', function() {
            expect(qcPage.getIncorrectRows().count()).toBe(2);
        })

        it('should show incorrect feedback if supplied', function() {
            expect(qcPage.getRowFeedback().getText()).toContain(questionData.feedbackIncorrect);
            qcPage.clickRowContinue();
        });
    });

    describe('when on a matching question', function() {
        var questionData = quizData.question4,
            matchingDistractorFirst = false;

        it('should properly show the question', function() {
            expect(qcPage.getQuestionText()).toBe(''); //no question text here
        });

        it('should show the prompts', function() {
            var prompts = qcPage.getMatchingPrompts();
            expect(prompts.get(0).getText()).toBe(questionData.prompt1);
            expect(prompts.get(1).getText()).toBe(questionData.prompt2);
        });

        it('should show the answer options in the dropdowns', function() {
            //ugh. so laravel will sometimes return the distractor first, sometimes last. it's sorting by a field that
            //is null for distractors. couldn't tell you why it does one, then the other. couldn't find a way to make it
            //do one or the other in the code, since we don't have a 'distractor' column. so we have to check here for
            //whether the distractor is first or last, and adjust tests accordingly. otherwise we get false negatives.
            qcPage.getSelects().get(0).getText(function(text) {
                if (text === questionData.distractor) {
                    matchingDistractorFirst = true;
                }
            });

            qcPage.getSelects().each(function(select) {
                var options = select.all(by.css('option'));
                expect(options.get(0).getText()).toBe(''); //blank first option for answer-switching
                if (matchingDistractorFirst) {
                    expect(options.get(1).getText()).toBe(questionData.distractor);
                    expect(options.get(2).getText()).toBe(questionData.answer1);
                    expect(options.get(3).getText()).toBe(questionData.answer2);
                }
                else {
                    expect(options.get(1).getText()).toBe(questionData.answer1);
                    expect(options.get(2).getText()).toBe(questionData.answer2);
                    expect(options.get(3).getText()).toBe(questionData.distractor);
                }
            });
        });

        it('should show the answer options in a row above the table', function() {
            var selectables = qcPage.getSelectables();
            if (matchingDistractorFirst) {
                expect(selectables.get(0).getText()).toBe(questionData.distractor);
                expect(selectables.get(1).getText()).toBe(questionData.answer1);
                expect(selectables.get(2).getText()).toBe(questionData.answer2);
            }
            else {
                expect(selectables.get(0).getText()).toBe(questionData.answer1);
                expect(selectables.get(1).getText()).toBe(questionData.answer2);
                expect(selectables.get(2).getText()).toBe(questionData.distractor);
            }
        });

        it('should disable the submit button until all matching answers are selected', function() {
            expect(qcPage.isSubmitBtnDisabled()).toBe(true);
        });

        it('should gray out a matching option box after it has been selected but not the others', function() {
            var selectables = qcPage.getSelectables();
            qcPage.selectOption(0, questionData.answer2);
            //we selected the second option
            if (matchingDistractorFirst) {
                expect(qcPage.isSelectablePicked(0)).toBe(false);
                expect(qcPage.isSelectablePicked(1)).toBe(false);
                expect(qcPage.isSelectablePicked(2)).toBe(true);
            }
            else {
                expect(qcPage.isSelectablePicked(0)).toBe(false);
                expect(qcPage.isSelectablePicked(1)).toBe(true);
                expect(qcPage.isSelectablePicked(2)).toBe(false);
            }
        });

        it('should hide a matching option from future rows when the option has already been selected', function() {
            qcPage.getSelects().get(1).all(by.css('option')).each(function(option) {
                option.getText().then(function(text) {
                    if (text.indexOf(questionData.answer2) > -1) {
                        //for some reason isDisplayed() was being funny with me, so had to check that ng-hide was activated on it
                        expect(option.getAttribute('class')).toContain('ng-hide');
                    }
                });
            });
        });

        it('should show incorrect feedback', function() {
            qcPage.selectOption(1, questionData.distractor);
            qcPage.submit();
            expect(qcPage.isIncorrectRowFeedback()).toBe(true);
        });

        it('should show incorrect rows', function() {
            expect(qcPage.getIncorrectRows().count()).toBe(2);
            qcPage.clickRowContinue();
        });
    });

    describe('when on a multiple dropdowns question', function() {
        var questionData = quizData.question5;

        it('should properly show the question', function() {
            expect(qcPage.getQuestionText()).toBe(''); //no question text here
        });

        it('should properly display prompts', function() {
            var prompts = qcPage.getDropdownPrompts(),
                promptLabels = [ questionData.prompt1, questionData.prompt2 ];

            prompts.each(function(prompt, index) {
                expect(prompt.getText()).toBe(promptLabels[index]);
            });
        });

        it('should properly display answer options, including distractors', function() {
            var selects = qcPage.getSelects(),
                answers = [ questionData.answer1, questionData.answer2, questionData.distractor ];

            //this is a spot where the order may change for apparently no reason from Laravel, so
            //just making sure each answer is represented somewhere, rather than a specific order
            selects.each(function(select) {
                answers.forEach(function(answer) {
                    expect(select.getText()).toContain(answer);
                });
            });
        });

        it('should show the answer options in a row above the table', function() {
            //once again, order changes for no reason from Laravel, so run down the list
            var selectables = qcPage.getSelectables(),
                answer1Found = false,
                answer2Found = false,
                distractorFound = false;

            selectables.each(function(selectable) {
                selectable.getText().then(function(text) {
                    if (text.indexOf(questionData.answer1) > -1) {
                        answer1Found = true;
                    }
                    else if (text.indexOf(questionData.answer2) > -1) {
                        answer2Found = true;
                    }
                    else if (text.indexOf(questionData.distractor) > -1) {
                        distractorFound = true;
                    }
                });
            })
            .then(function() {
                expect(answer1Found).toBe(true);
                expect(answer2Found).toBe(true);
                expect(distractorFound).toBe(true);
            });
        });

        it('should disable the submit button until all multiple dropdown answers are selected', function() {
            expect(qcPage.isSubmitBtnDisabled()).toBe(true);
        });

        it('should gray out an option box after it has been selected but not the others', function() {
            //once again, since order changes from Laravel, run through the whole list
            qcPage.selectOption(0, questionData.answer2);
            qcPage.getSelectables().each(function(selectable, index) {
                selectable.getText().then(function(text) {
                    if (text.indexOf(questionData.answer1) > -1) {
                        expect(qcPage.isSelectablePicked(index)).toBe(false);
                    }
                    else if (text.indexOf(questionData.answer2) > -1) {
                        expect(qcPage.isSelectablePicked(index)).toBe(true);
                    }
                    else if (text.indexOf(questionData.distractor) > -1) {
                        expect(qcPage.isSelectablePicked(index)).toBe(false);
                    }
                });
            });
        });

        it('should hide an option from future rows when the option has already been selected', function() {
            qcPage.getSelects().get(1).all(by.css('option')).each(function(option) {
                option.getText().then(function(text) {
                    if (text.indexOf(questionData.answer2) > -1) {
                        //for some reason isDisplayed() was being funny with me, so had to check that ng-hide was activated on it
                        expect(option.getAttribute('class')).toContain('ng-hide');
                    }
                });
            });
        });

        it('should mark the multiple dropdowns answer as incorrect when answered incorrectly', function() {
            qcPage.selectOption(1, questionData.distractor);
            qcPage.submit();
            expect(qcPage.isIncorrectModal()).toBe(true);
            qcPage.clickContinue();
        });
    });

    describe('when on a textmatch question', function() {
        var questionData = quizData.question6;

        it('should properly show a textmatch question', function() {
            expect(qcPage.getQuestionText()).toBe(''); //no question text here
        });

        it('should disable the submit button until a textmatch answer is selected', function() {
            expect(qcPage.isSubmitBtnDisabled()).toBe(true);
        });

        it('should mark the textmatch answer as incorrect when answered incorrectly', function() {
            qcPage.enterTextmatchAnswer('Totally the wrong answer');
            qcPage.submit();
            expect(qcPage.isIncorrectModal()).toBe(true);
            qcPage.clickContinue();
        });
    });

    describe('when on a numerical question', function() {
        var questionData = quizData.question7;

        it('should properly show a numeric question', function() {
            expect(qcPage.getQuestionText()).toBe(''); //no question text here
        });

        it('should disable the submit button until a numeric answer is selected', function() {
            expect(qcPage.isSubmitBtnDisabled()).toBe(true);
        });

        it('should mark the numeric question as incorrect when answered incorrectly', function() {
            qcPage.enterNumericalAnswer('10000000');
            qcPage.submit();
            expect(qcPage.isIncorrectModal()).toBe(true);
        });
    });

    describe('when the quick check is finished', function() {
        it('should show a message that the quick check has been completed', function() {
            qcPage.clickContinue();
            expect(qcPage.isQcFinished()).toBe(true);
        });

        it('should show a score of 0 when all questions were answered incorrectly', function() {
            expect(qcPage.getFinalScore()).toBe('score: 0 / 7 questions correct');
        });

        it('should show a message that the attempt has been graded', function() {
            expect(qcPage.isQcGraded()).toBe(true);
        });

        it('should NOT show directions to click the module next button when not in a module', function() {
            expect(qcPage.isModuleMessagePresent()).toBe(false);
        });
    });
});

describe('Taking a graded quick check and getting all answers correct', function() {
    var quizData = data.quizData.quiz1;

    it('should reinitialize the quiz after clicking the restart button', function() {
        qcPage.restart();
        expect(qcPage.getQuestionProgress()).toBe('question 1 out of 7');
        common.saveOptionList(qcPage.getMcOptions());
    });

    //compare the option order in this one vs. the 2 previous attempts
    it('should randomize options when randomization is turned on', function() {
        expect(common.areOptionsRandomized()).toBe(true);
    });

    describe('when on a multiple choice question', function() {
        var questionData = quizData.question1;

        it('should mark the answer as correct when answered correctly', function() {
            qcPage.getMcOptions().each(function(option, index) {
                option.getText().then(function(text) {
                    if (text.indexOf(questionData.answer) > -1) {
                        qcPage.selectMcOptionByIndex(index);
                        qcPage.submit();
                        expect(qcPage.isCorrectModal()).toBe(true);
                    }
                });
            });
        });

        it('should show per-response correct feedback if supplied', function() {
            var feedback = qcPage.getPerResponseFeedback();
            expect(feedback.count()).toBe(1);
            expect(feedback.first().getText()).toBe(questionData.feedbackOption2);
            qcPage.clickContinue();
        });

        it('should increment the score after answering correctly', function() {
            expect(qcPage.getScore()).toBe('1 / 7 questions correct');
        });
    });

    describe('for a multiple correct question', function() {
        var questionData = quizData.question2;

        it('should mark the answer as correct when answered correctly', function() {
            qcPage.selectMcOptionByIndex(questionData.answer1);
            qcPage.selectMcOptionByIndex(questionData.answer2);
            qcPage.submit();
            expect(qcPage.isCorrectModal()).toBe(true);
        });

        it('should show per-response correct feedback if supplied', function() {
            var feedback = qcPage.getPerResponseFeedback();
            expect(feedback.count()).toBe(2);
            expect(feedback.get(0).getText()).toBe(questionData.feedbackOption1);
            expect(feedback.get(1).getText()).toBe(questionData.feedbackOption2);
            qcPage.clickContinue();
        });
    });

    describe('for a matrix question', function() {
        var questionData = quizData.question3;

        it('should mark the answer as correct when answered correctly', function() {
            qcPage.selectMatrixCheckboxByIndex(questionData.answer1);
            qcPage.selectMatrixCheckboxByIndex(questionData.answer2);
            qcPage.submit();
            expect(qcPage.isCorrectRowFeedback()).toBe(true);
        });

        it('should not show any incorrect rows', function() {
            expect(qcPage.getIncorrectRows().count()).toBe(0);
        });

        it('should show question-level correct feedback if supplied', function() {
            expect(qcPage.getRowFeedback().getText()).toContain(questionData.feedbackCorrect);
            qcPage.clickRowContinue();
        });
    });

    describe('for a matching question', function() {
        var questionData = quizData.question4;

        it('should mark the answer as correct when a matching question has been answered correctly', function() {
            qcPage.selectOption(0, questionData.answer1);
            qcPage.selectOption(1, questionData.answer2);
            qcPage.submit();
            expect(qcPage.isCorrectRowFeedback()).toBe(true);
        });

        it('should not show any incorrect rows', function() {
            expect(qcPage.getIncorrectRows().count()).toBe(0);
            qcPage.clickRowContinue();
        });
    });

    describe('for a multiple dropdowns question', function() {
        var questionData = quizData.question5;

        it('should mark the answer as correct when a multiple dropdown question has been answered correctly', function() {
            qcPage.selectOption(0, questionData.answer1);
            qcPage.selectOption(1, questionData.answer2);
            qcPage.submit();
            expect(qcPage.isCorrectModal()).toBe(true);
            qcPage.clickContinue();
        });
    });

    describe('for a textmatch question', function() {
        var questionData = quizData.question6;

        it('should mark the answer as correct when a textmatch question has been answered correctly, and match regardless of capitalization, punctuation, or trailing spaces', function() {
            var answer = questionData.option1.toLowerCase() + '!    ';
            qcPage.enterTextmatchAnswer(answer);
            qcPage.submit();
            expect(qcPage.isCorrectModal()).toBe(true);
            qcPage.clickContinue();
        });
    });

    describe('for a numerical question', function() {
        var questionData = quizData.question7;

        it('should mark the answer as correct when a numeric question has been answered correctly', function() {
            qcPage.enterNumericalAnswer(questionData.option1);
            qcPage.submit();
            expect(qcPage.isCorrectModal()).toBe(true);
            qcPage.clickContinue();
        });
    });

    it('should show the completion modal when finished', function() {
        expect(qcPage.isCompletionModalVisible()).toBe(true);
    });

    it('should show a perfect score when all answers were answered correctly', function() {
        expect(qcPage.getFinalScore()).toBe('score: 7 / 7 questions correct');
    });

    it('should show a message that the attempt has been graded', function() {
        expect(qcPage.isQcGraded()).toBe(true);
    });
});