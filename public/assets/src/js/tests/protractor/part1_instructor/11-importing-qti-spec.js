var EC = protractor.ExpectedConditions,
    includes = require('../common/includes.js'),
    common = new includes.Common(browser),
    data = includes.data,
    editQcPage = new includes.EditQcPage(browser),
    path = require('path'),
    setPage = new includes.SetPage(browser),
    viewSetsPage = new includes.ViewSetsPage(browser);

describe('Importing a QTI package', function() {
    var set;

    beforeEach(function() {
        set = data.sets.featuresAllOn;
    });

    it('should show the necessary form when clicked', function() {
        //we're in the first set, which has grade passback on -- need to test 2 quizzes with grade passback on, since there was
        //a bug we had to fix where taking a second quick check with grade passback on resulted in an error
        setPage.clickImportQtiBtn();
        expect(setPage.qtiImport.getDropdown().isDisplayed()).toBe(true);
    });

    it('should show all assessment groups in the dropdown', function() {
        expect(setPage.qtiImport.getDropdownOptions().count()).toBe(3); //1 blank and 2 groups
        expect(setPage.qtiImport.getDropdownOptions().get(1).getText()).toBe(set.subsets.group1);
        expect(setPage.qtiImport.getDropdownOptions().get(2).getText()).toBe(set.subsets.group2);
    });

    it('should throw an error if no assessment group is selected', function() {
        setPage.qtiImport.submit();
        expect(setPage.qtiImport.isImportFinished()).toBe(false);
    });

    it('should throw an error if no file is uploaded', function() {
        setPage.qtiImport.getDropdown().sendKeys(set.subsets.group2);
        setPage.qtiImport.submit();
        expect(setPage.qtiImport.isImportFinished()).toBe(false);
    });

    it('should show a particular message if there were validation notices', function() {
        //now we upload an actual file
        //http://stackoverflow.com/questions/21305298/how-to-upload-file-in-angularjs-e2e-protractor-testing
        var fileToUpload = 'includes/qti.zip',
            absolutePath = path.resolve(__dirname, fileToUpload);

        setPage.qtiImport.uploadFile(absolutePath);
        setPage.qtiImport.submit();
        browser.wait(EC.presenceOf(setPage.qtiImport.getFinishedPanel()), 10000);
        expect(setPage.qtiImport.getNotices().count()).toBe(10);
    });

    it('should show validation notices for LMS-specific material and unsupported question types', function() {
        setPage.qtiImport.getNotices().then(function(notices) {
            expect(notices[0].getText()).toContain('LMS-specific content was removed');
            expect(notices[1].getText()).toContain('incompatible feedback');
            expect(notices[2].getText()).toContain('The question type Fill in multiple blanks is not supported');
            expect(notices[3].getText()).toContain('incompatible feedback');
            expect(notices[4].getText()).toContain('incompatible feedback');
            expect(notices[5].getText()).toContain('incompatible feedback');
            expect(notices[6].getText()).toContain('The question type Calculated is not supported');
            expect(notices[7].getText()).toContain('The question type Essay is not supported');
            expect(notices[8].getText()).toContain('The question type File upload is not supported');
            expect(notices[9].getText()).toContain('The question type Text only is not supported');
        });
    });

    it('should not show an error if the XML was correctly formed', function() {
        expect(setPage.qtiImport.getError().isPresent()).toBe(false);
    });

    it('should now show a critical notice if the XML was correctly formed', function() {
        expect(setPage.qtiImport.getCriticalError().isPresent()).toBe(false);
    });

    it('should not show an outright success message if there were validation errors present', function() {
         expect(setPage.qtiImport.getSuccess().isPresent()).toBe(false);
    });

    it('should show links to the newly created quizzes', function() {
        expect(setPage.qtiImport.getImportLinks().count()).toBe(2);
    });

    describe('should put the correct question data into the newly created quizzes', function() {
        //testing first QTI import quiz (they're in reverse order of import):
        describe('for total number of questions', function() {
            it('should have the correct question count', function() {
                setPage.qtiImport.getImportLinks().get(1).click();
                browser.sleep(1000);
                editQcPage.initQuestions();
                expect(editQcPage.getQuestions().count()).toBe(8);
            });
        });

        //NOTE: for the first quiz, we are not later using it as a student. it's just here for testing all
        //the possibilities of QTI import. there are hard-coded strings in here for question text, answers,
        //etc., since these values do not appear anywhere else in the tests.
        describe('for title and description', function() {
            it('should have the correct title', function() {
                expect(editQcPage.getTitleInput().getAttribute('value')).toBe(data.qtiImports.quiz1);
            });

            it('should have the correct description', function() {
                expect(editQcPage.getDescriptionInput().getAttribute('value')).toBe('This is the quiz description.');
            });
        });

        describe('for a multiple choice question', function() {
            var question;

            beforeEach(function() {
                question = editQcPage.getQuestion(0);
            });

            //check question text only for 1st (assuming if it works on 1st, works on all; same mechanism)
            it('should have the correct question text', function() {
                common.enterTinyMceIframeInElement(question.question);
                common.enterNonAngularPage();
                expect(common.getTinyMceText()).toBe('Answer is A. Here is an image:');
                common.leaveTinyMceIframe();
                common.switchToLtiTool();
            });

            it('should have the correct question type', function() {
                common.enterAngularPage();
                expect(question.getQuestionType()).toBe(data.questionTypes.mc);
            });

            it('should have the correct options', function() {
                var option1 = question.getOptions().get(0),
                    option2 = question.getOptions().get(1),
                    option3 = question.getOptions().get(2),
                    option4 = question.getOptions().get(3);

                expect(question.getMcOptionInputValue(option1)).toBe('A');
                expect(question.getMcOptionInputValue(option2)).toBe('B');
                expect(question.getMcOptionInputValue(option3)).toBe('C');
                expect(question.getMcOptionInputValue(option4)).toBe('D');
            });

            it('should have correctness properly marked', function() {
                var correctOption = question.getOptions().get(0);
                expect(question.isMcOptionMarkedCorrect(correctOption)).toBe(true);
            });

            it('should have the proper per-response feedback', function() {
                var feedback = question.feedback.getPerResponseFeedbackOptions(),
                    feedbackOption1 = feedback.get(0),
                    feedbackOption2 = feedback.get(1),
                    feedbackOption3 = feedback.get(2),
                    feedbackOption4 = feedback.get(3);

                expect(question.feedback.getPerResponseFeedbackText(feedbackOption1)).toBe('Feedback for A');
                expect(question.feedback.getPerResponseFeedbackText(feedbackOption2)).toBe('Feedback for B');
                expect(question.feedback.getPerResponseFeedbackText(feedbackOption3)).toBe('Feedback for C');
                expect(question.feedback.getPerResponseFeedbackText(feedbackOption4)).toBe('Feedback for D');
            });
        });

        describe('for a multiple correct question', function() {
            var question,
                option1,
                option2,
                option3;

            beforeEach(function() {
                question = editQcPage.getQuestion(1);
                option1 = question.getOptions().get(0),
                option2 = question.getOptions().get(1),
                option3 = question.getOptions().get(2);
            });

            it('should have the correct question type', function() {
                expect(question.getQuestionType()).toBe(data.questionTypes.mcorrect);
            });

            it('should have the correct options', function() {
                expect(question.getMcOptionInputValue(option1)).toBe('Red');
                expect(question.getMcOptionInputValue(option2)).toBe('Orange');
                expect(question.getMcOptionInputValue(option3)).toBe('Blue');
            });

            it('should have correctness properly marked', function() {
                expect(question.isMcOptionMarkedCorrect(option1)).toBe(true);
                expect(question.isMcOptionMarkedCorrect(option2)).toBe(true);
                expect(question.isMcOptionMarkedCorrect(option3)).toBe(false);
            });

            it('should have the proper per-response feedback', function() {
                var feedback = question.feedback.getPerResponseFeedbackOptions(),
                    feedbackOption1 = feedback.get(0),
                    feedbackOption2 = feedback.get(1),
                    feedbackOption3 = feedback.get(2);

                expect(question.feedback.getPerResponseFeedbackText(feedbackOption1)).toBe('Feedback for Red');
                expect(question.feedback.getPerResponseFeedbackText(feedbackOption2)).toBe('Feedback for Orange');
                expect(question.feedback.getPerResponseFeedbackText(feedbackOption3)).toBe('Feedback for Blue');
            });
        });

        //true/false in Canvas converts to multiple choice
        describe('for a true/false question', function() {
            var question,
                option1,
                option2;

            beforeEach(function() {
                question = editQcPage.getQuestion(2);
                option1 = question.getOptions().get(0);
                option2 = question.getOptions().get(1);
            });

            it('should have the correct question type', function() {
                expect(question.getQuestionType()).toBe(data.questionTypes.mc);
            });

            it('should have the correct options', function() {
                expect(question.getMcOptionInputValue(option1)).toBe('True');
                expect(question.getMcOptionInputValue(option2)).toBe('False');
            });

            it('should have correctness properly marked', function() {
                expect(question.isMcOptionMarkedCorrect(option1)).toBe(true);
            });

            it('should have the proper per-response feedback', function() {
                var feedback = question.feedback.getPerResponseFeedbackOptions(),
                    feedbackOption1 = feedback.get(0),
                    feedbackOption2 = feedback.get(1);

                expect(question.feedback.getPerResponseFeedbackText(feedbackOption1)).toBe('Feedback for True');
                expect(question.feedback.getPerResponseFeedbackText(feedbackOption2)).toBe('Feedback for False');
            });
        });

        describe('for a textmatch question', function() {
            var question;

            beforeEach(function() {
                question = editQcPage.getQuestion(3);
            });

            it('should have the correct question type', function() {
                expect(question.getQuestionType()).toBe(data.questionTypes.textmatch);
            });

            it('should have the correct options', function() {
                var option1 = question.getOptions().get(0),
                    option2 = question.getOptions().get(1);

                expect(question.getOptionInput(option1).getAttribute('value')).toBe('mozzarella');
                expect(question.getOptionInput(option2).getAttribute('value')).toBe('parmesan');
            });

            it('should have the proper correct/incorrect feedback', function() {
                expect(question.feedback.getCorrectFeedback().getAttribute('value')).toBe('Question correct feedback');
                expect(question.feedback.getIncorrectFeedback().getAttribute('value')).toBe('Question incorrect feedback');
            });
        });

        describe('for a multiple dropdowns question', function() {
            var question;

            beforeEach(function() {
                question = editQcPage.getQuestion(4);
            });

            it('should have the correct question type', function() {
                expect(question.getQuestionType()).toBe(data.questionTypes.dropdowns);
            });

            it('should have the correct options', function() {
                var inputs = question.getDropdownTextInputs();
                expect(inputs.get(0).getAttribute('value')).toBe('The sky is ');
                expect(inputs.get(1).getAttribute('value')).toBe('blue');
                expect(inputs.get(2).getAttribute('value')).toBe(' and the grass is ');
                expect(inputs.get(3).getAttribute('value')).toBe('green');
            });
        });

        describe('for a matching question', function() {
            var question;

            beforeEach(function() {
                question = editQcPage.getQuestion(5);
            });

            it('should have the correct question type', function() {
                expect(question.getQuestionType()).toBe(data.questionTypes.matching);
            });

            it('should have the correct options', function() {
                var options = question.getMatchingPairInputs();
                expect(options.get(0).getAttribute('value')).toBe('Indianapolis');
                expect(options.get(1).getAttribute('value')).toBe('Indiana');
                expect(options.get(2).getAttribute('value')).toBe('Springfield');
                expect(options.get(3).getAttribute('value')).toBe('Illinois');
            });

            it('should have the correct distractors', function() {
                var distractor = question.getDistractors().get(0);
                expect(question.getDistractorInput(distractor).getAttribute('value')).toBe('Ohio');
            });
        });

        describe('for a numerical question', function() {
            var question;

            beforeEach(function() {
                question = editQcPage.getQuestion(6);
            });

            it('should have the correct question type', function() {
                expect(question.getQuestionType()).toBe(data.questionTypes.numerical);
            });

            it('should have the correct options', function() {
                var option1 = question.getOptions().get(0),
                    option2 = question.getOptions().get(1),
                    option3 = question.getOptions().get(2);

                expect(question.getExactAnswerInput(option1).getAttribute('value')).toBe('2');
                expect(question.getMarginOfErrorInput(option1).getAttribute('value')).toBe('0');

                expect(question.getRangeMinInput(option2).getAttribute('value')).toBe('4');
                expect(question.getRangeMaxInput(option2).getAttribute('value')).toBe('6');

                expect(question.getExactAnswerInput(option3).getAttribute('value')).toBe('10');
                expect(question.getMarginOfErrorInput(option3).getAttribute('value')).toBe('1');
            });
        });

        describe('for a multiple correct question imported from a question bank', function() {
            var question;

            beforeEach(function() {
                question = editQcPage.getQuestion(7);
            });

            it('should have the correct question type', function() {
                expect(question.getQuestionType()).toBe(data.questionTypes.mcorrect);
            });

            it('should have the correct options', function() {
                var option1 = question.getOptions().get(0),
                    option2 = question.getOptions().get(1),
                    option3 = question.getOptions().get(2);

                expect(question.getMcOptionInputValue(option1)).toBe('A');
                expect(question.isMcOptionMarkedCorrect(option1)).toBe(true);
                expect(question.getMcOptionInputValue(option2)).toBe('B');
                expect(question.getMcOptionInputValue(option3)).toBe('C');

                editQcPage.save();
                editQcPage.goBackToSet();
                setPage.initSubsets().then(function() {
                    subset = setPage.getSubset(1);
                    subset.editQuickCheck(subset.getQuickChecks().get(1));
                    editQcPage.initQuestions();
                });
            });
        });

        //testing second QTI import quiz:
        describe('for the second quiz', function() {
            var question,
                option1,
                option2,
                option3,
                option4;

            beforeEach(function() {
                question = editQcPage.getQuestion(0);
                option1 = question.getOptions().get(0);
                option2 = question.getOptions().get(1);
                option3 = question.getOptions().get(2);
                option4 = question.getOptions().get(3);
            });

            it('should have a correct title', function() {
                expect(editQcPage.getTitleInput().getAttribute('value')).toBe(data.qtiImports.quiz2);
            });

            it('should have a correct description', function() {
                expect(editQcPage.getDescriptionInput().getAttribute('value')).toBe('');
            });

            it('should have the correct number of questions', function() {
                expect(editQcPage.getQuestions().count()).toBe(1);
            });

            it('should have the correct question type', function() {
                expect(question.getQuestionType()).toBe(data.questionTypes.mc);
            });

            it('should have the correct options', function() {
                expect(question.getMcOptionInputValue(option1)).toBe('A');
                expect(question.getMcOptionInputValue(option2)).toBe('B');
                expect(question.getMcOptionInputValue(option3)).toBe('C');
                expect(question.getMcOptionInputValue(option4)).toBe('D');
            });

            it('should have correctness marked', function() {
                expect(question.isMcOptionMarkedCorrect(option2)).toBe(true);
            });

            it('should have per response feedback', function() {
                //test the scenario where only some response feedback is filled in by Canvas
                //(not allowed in our system, so QTI import gives a blank string as feedback)
                var feedback = question.feedback.getPerResponseFeedbackOptions(),
                    feedbackOption1 = feedback.get(0),
                    feedbackOption2 = feedback.get(1),
                    feedbackOption3 = feedback.get(2),
                    feedbackOption4 = feedback.get(3);

                expect(question.feedback.getPerResponseFeedbackText(feedbackOption1)).toBe(' ');
                expect(question.feedback.getPerResponseFeedbackText(feedbackOption2)).toBe('Great job, this is correct.');
                expect(question.feedback.getPerResponseFeedbackText(feedbackOption3)).toBe('Oh no, this is terrible. You are such an idiot. I can\'t believe you chose C, of all things.');
                expect(question.feedback.getPerResponseFeedbackText(feedbackOption4)).toBe(' ');

                //go back
                editQcPage.save();
                editQcPage.goBackToSet();
            });
        });
    });

    it('should place the imported content into the appropriate subset', function() {
        var subset;

        setPage.initSubsets().then(function() {
            //there is already 1 assessment in this group, then the second quiz is listed before the first; I think this is just a
            //remnant from Canvas naming the files gobbledygook and thus they are not necessarily alphabetized in the correct order
            subset = setPage.getSubset(1);
            expect(subset.getQuickChecks().count()).toBe(3);
            expect(subset.getQuickChecks().get(1).getText()).toContain(data.qtiImports.quiz2);
            expect(subset.getQuickChecks().get(2).getText()).toContain(data.qtiImports.quiz1);
        });
    });
});
