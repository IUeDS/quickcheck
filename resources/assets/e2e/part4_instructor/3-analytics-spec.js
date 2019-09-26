var includes = require('../common/includes.js'),
    data = includes.data,
    common = new includes.Common(browser),
    attemptsPage = new includes.AttemptsPage(browser);

describe('Viewing analytics for an assessment', function() {
    var analytics = attemptsPage.analytics, //for easier typing
        quizData = data.quizData.quiz1;

    it('should show buttons for downloading responses CSV and attempts CSV', async function() {
        await attemptsPage.viewAnalytics();
        expect(await analytics.getResponsesCsvBtn().isDisplayed()).toBe(true);
        expect(await analytics.getAttemptsCsvBtn().isDisplayed()).toBe(true);
    });

    it('should show the correct number of total attempts', async function() {
        expect(await analytics.getTotalAttempts()).toContain('4');
    });

    it('should show the correct number of attempts per student', async function() {
        expect(await analytics.getAvgAttempts()).toContain('2');
    });

    it('should show the correct median score', async function() {
        expect(await analytics.getMedianScore()).toContain('50%');
    });

    it('should show the average time spent', async function() {
        //we can't know the exact time for sure, but we know it's less than a minute
        expect(await analytics.getAvgTime()).toContain('seconds');
    });

    it('should show the correct percentage of students who got a question right', async function() {
        expect(await analytics.getQuestionPercentCorrect(0)).toContain('50%');
    });

    it('should show the question text for a question', async function() {
        expect(await analytics.getQuestionText(0)).toContain(quizData.question1.questionText);
    });

    describe('for a multiple choice question', function() {
        var questionData = quizData.question1,
            options = analytics.getMcOptions(0),
            optionItems = [ questionData.option1, questionData.option2, questionData.option3, questionData.option4 ],
            percentages = analytics.getOptionPercentages(0);

        it('should show the options correctly', async function() {
            for (let [index, optionItem] of optionItems.entries()) {
                expect(await options.get(index).getText()).toBe(optionItem);
            }
        });

        it('should show the percentages correctly', async function() {
            //note: since we randomly select a wrong answer the first time, we can't know for sure what the option %s
            //are aside from when we selected the correct answer. Since multiple correct uses the same function
            //to calculate these statistics but isn't randomized, that should cover our bases.
            expect(await percentages.get(1).getText()).toContain('50%');
        });
    });

    describe('for a multiple correct question', function() {
        var questionData = quizData.question2,
            options = analytics.getMcOptions(1),
            optionItems = [ questionData.option1, questionData.option2, questionData.option3, questionData.option4 ],
            percentages = analytics.getOptionPercentages(1),
            percentageItems = [ '100%', '50%', '0%', '0%' ];

        it('should show the options correctly', async function() {
            for (let [index, optionItem] of optionItems.entries()) {
                expect(await options.get(index).getText()).toBe(optionItem);
            }
        });

        it('should show the percentages correctly', async function() {
            for (let [index, percentageItem] of percentageItems.entries()) {
                expect(await percentages.get(index).getText()).toContain(percentageItem);
            }
        });
    });

    describe('for a matrix question', function() {
        var questionData = quizData.question3,
            columns = analytics.getMatrixColumns(2),
            columnItems = [ questionData.column1, questionData.column2 ],
            rows = analytics.getMatrixRows(2),
            rowItems = [ questionData.row1, questionData.row2 ],
            percentages = analytics.getOptionPercentages(2);

        it('should have the correct row options', async function() {
            for (let [index, rowItem] of rowItems.entries()) {
                expect(await rows.get(index).getText()).toContain(rowItem);
            }
        });

        it('should have the correct column options', async function() {
            for (let [index, columnItem] of columnItems.entries()) {
                expect(await columns.get(index).getText()).toContain(columnItem);
            }
        });

        it('should have the correct percentages', async function() {
            var i = 0;

            percentages.each(async function(percentage) {
                expect(await percentage.getText()).toContain('50%');
            });
        });
    });

    describe('for a matching question', function() {
        var questionData = quizData.question4,
            answers = analytics.getMatchingAnswers(3),
            answerItems = [ questionData.answer1, questionData.answer2, questionData.distractor ];
            prompts = analytics.getMatchingPrompts(3),
            promptItems = [ questionData.prompt1, questionData.prompt2 ],
            percentages = analytics.getOptionPercentages(3),
            percentageItems = [ '50%', '50%', '0%', '0%', '50%', '50%' ];

        it('should have the correct prompts', async function() {
            for (let [index, promptItem] of promptItems.entries()) {
                expect(await prompts.get(index).getText()).toContain(promptItem);
            }
        });

        it('should have the correct answers', async function() {
            for (let [index, answerItem] of answerItems.entries()) {
                expect(await answers.get(index).getText()).toContain(answerItem);
            }
        });

        it('should have the correct percentages', async function() {
            for (let [index, percentageItem] of percentageItems.entries()) {
                expect(await percentages.get(index).getText()).toContain(percentageItem);
            }
        });
    });

    describe('for a dropdown question', function() {
        var questionData = quizData.question5,
            answers = analytics.getDropdownAnswers(4),
            answerItems = [ questionData.answer1, questionData.answer2, questionData.distractor ];
            prompts = analytics.getDropdownPrompts(4),
            promptItems = [ questionData.prompt1, questionData.prompt2 ],
            percentages = analytics.getOptionPercentages(4),
            percentageItems = [ '50%', '50%', '0%', '0%', '50%', '50%' ];

        it('should have the correct prompts', async function() {
            for (let [index, promptItem] of promptItems.entries()) {
                expect(await prompts.get(index).getText()).toContain(promptItem);
            }
        });

        it('should have the correct answers', async function() {
            for (let [index, answerItem] of answerItems.entries()) {
                expect(await answers.get(index).getText()).toContain(answerItem);
            }
        });

        it('should have the correct percentages', async function() {
            for (let [index, percentageItem] of percentageItems.entries()) {
                expect(await percentages.get(index).getText()).toContain(percentageItem);
            }
        });
    });

    describe('for a textmatch question', function() {
        var questionData = quizData.question6,
            answers = analytics.getTextmatchAnswers(5),
            percentages = analytics.getOptionPercentages(5);

        it('should have the correct answers', async function() {
            expect(await answers.get(0).getText()).toContain(questionData.option1);
        });

        it('should have the correct percentages', async function() {
            expect(await percentages.get(0).getText()).toContain('50%');
        });

        it('should show other responses', async function() {
            var responses;

            await analytics.toggleOtherResponses(5);
            await responses = analytics.getOtherResponses();
            //I have no idea why, but angular flakes out intermittently here. doesn't with numerical.
            //works just fine manually. but here, requires a second click sometimes. maybe a focus issue?
            const responseount = await responses.count();
            if (responseCount === 0) {
                await analytics.toggleOtherResponses(5);
                responses = analytics.getOtherResponses();
            }
            expect(await responses.count()).toBe(1);
            expect(await responses.get(0).getText()).toBe('Totally the wrong answer');
            await analytics.toggleOtherResponses(5); //close
        });
    });

    describe('for a numerical question', function() {
        var questionData = quizData.question7,
            answers = analytics.getNumericalAnswers(6),
            percentages = analytics.getOptionPercentages(6);

        it('should have the correct answers', async function() {
            expect(await answers.get(0).getText()).toContain(questionData.option1);
        });

        it('should have the correct percentages', async function() {
            expect(await percentages.get(0).getText()).toContain('50%');
        });

        it('should show other responses', async function() {
            var responses;

            await analytics.toggleOtherResponses(6);
            responses = analytics.getOtherResponses();
            expect(await responses.count()).toBe(1);
            expect(await responses.get(0).getText()).toBe('10000000.000000');
            await analytics.goBack();
            await attemptsPage.goBack();
        });
    });
});