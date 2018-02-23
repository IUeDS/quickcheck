var browser2 = browser.params.browser2,
    includes = require('../common/includes.js'),
    data = includes.data,
    common = new includes.Common(browser2),
    canvasAssignmentsPage = new includes.CanvasAssignmentsPage(browser2),
    canvasModulesPage = new includes.CanvasModulesPage(browser2),
    qcPage = new includes.QcPage(browser2);

describe('Taking a non-graded quiz', function() {
    var qcName = data.sets.featuresAllOff.quickchecks.urlEmbed,
        quizData = data.quizData.quiz2;

    it('should show the quiz title when a title has been added', function() {
        common.switchToCanvas().then(function() {
            canvasAssignmentsPage.goToModules();
            canvasModulesPage.selectItemByLinkText(qcName);
            //this looks odd, but the problem is that changing browser synchronization for angular
            //and non-angular pages is synchronous rather than asynchronous, so I learned I had to
            //be careful about changing back to angular-specific stuff in the right spot in the
            //control flow, otherwise, it would fire off out of order and give an error saying that
            //angular was not on the window. tricky stuff!
            common.switchToLtiTool();
        }).then(function() {
            common.enterAngularPage();
            expect(qcPage.getTitle().getText()).toBe(qcName.toUpperCase());
        });
    });

    it('should show the quiz description when a description has been added', function() {
        expect(qcPage.getDescription().getText()).toBe('Description');
    });

    it('should reward partial credit for a half-correct matrix question', function() {
        qcPage.selectMatrixCheckboxByIndex(quizData.question1.answer1);
        qcPage.selectMatrixCheckboxByIndex(quizData.question1.answer2 + 1);
        qcPage.submit();
        expect(qcPage.getScore()).toBe('0.5 / 2 questions correct');
        qcPage.clickRowContinue();
    });

    it('should reward partial credit for a half-correct matching question', function() {
        qcPage.selectOption(0, quizData.question2.answer1); //correct
        qcPage.selectOption(1, quizData.question2.answer1); //incorrect
        qcPage.submit();
        expect(qcPage.getScore()).toBe('1 / 2 questions correct');
        qcPage.clickRowContinue();
    });

    it('should show a message that the quiz was not graded after completing', function() {
        expect(qcPage.isQcFinished()).toBe(true);
        expect(qcPage.isQcUngraded()).toBe(true);
    });

    it('should show directions to click the module next button when in a module', function() {
        expect(qcPage.isModuleMessagePresent()).toBe(true);
    });
});


//take the 3rd quiz, where grading is manual and past due
describe('Taking a manually graded quiz past the due date', function() {
    var qcName = data.sets.featuresAllOff.quickchecks.featuresAllOffPastDue,
        questionData = data.quizData.quiz3.question1;

    it('should mark a numerical question as correct if an exact answer match', function() {
        common.switchToCanvas().then(function() {
            canvasAssignmentsPage.goToAssignments();
            canvasAssignmentsPage.openAssignment(qcName);
            //refresh so we can test if empty attempts are actually hidden
            browser2.refresh();
         }).then(function() {
            common.switchToLtiTool();
         }).then(function() {
            common.enterAngularPage();
            qcPage.enterNumericalAnswer(questionData.option1.exact);
            qcPage.submit();
            expect(qcPage.isCorrectModal()).toBe(true);
            qcPage.clickContinue();
            //GAH! using EC.visibilityOf resulted in timeouts even though the element
            //was clearly visible. I have no choice but to just manually call sleep.
            //browser2.sleep(1000);
            qcPage.restart();
         });
    });

    it('should mark a numerical question correct if it falls within a margin of error', function() {
        var answer = +(questionData.option2.exact) - +(questionData.option2.margin);
        qcPage.enterNumericalAnswer(answer);
        qcPage.submit();
        expect(qcPage.isCorrectModal()).toBe(true);
        qcPage.clickContinue();
        //browser2.sleep(1000);
        qcPage.restart();
    });

    it('should mark a numerical question correct if it falls within a range', function() {
        qcPage.enterNumericalAnswer(questionData.option3.rangeMin);
        qcPage.submit();
        expect(qcPage.isCorrectModal()).toBe(true);
        qcPage.clickContinue();
        //browser2.sleep(1000);
        qcPage.restart();
    });

    it('should mark a numerical question incorrect if it falls outside of all ranges', function() {
        var answer = +(questionData.option3.rangeMax) + 1;
        qcPage.enterNumericalAnswer(answer);
        qcPage.submit();
        expect(qcPage.isIncorrectModal()).toBe(true);
        qcPage.clickContinue();
    });

    it('should show a message that a grade was not submitted if it is past the due date', function() {
        expect(qcPage.isQcFinished()).toBe(true);
        expect(qcPage.isQcUngraded()).toBe(true);
    });
});

//take the 4th quiz, where auto-grade will be used, in the collection with all features turned off
//nothing specifically to test here in the student view, just need to take the quiz, but leaving this here in case
//also, navigate to page and refresh, to test feature functionality of showing empty attempts
describe('Taking a quiz with responses hidden', function() {
    var qcName = data.sets.featuresAllOff.quickchecks.resultsNotReleased;

    it('should show a message that the quiz was not graded but will be later when completing', function() {
        common.switchToCanvas().then(function() {
            canvasAssignmentsPage.goToAssignments();
            canvasAssignmentsPage.openAssignment(qcName);
            //refresh so we can test if empty attempts are actually hidden
            browser2.refresh();
         }).then(function() {
            common.switchToLtiTool();
         }).then(function() {
            common.enterAngularPage();
            //pick an incorrect answer
            qcPage.selectMcOptionByIndex(0);
            qcPage.submit();
            qcPage.clickContinue();
            expect(qcPage.isQcFinished()).toBe(true);
            expect(qcPage.isQcPendingGrade()).toBe(true);
         });
    });
});

//Since there was a bug with taking 2 quizzes that both had grade passback, added this test in, using the QTI import quiz
//since the quiz was already available. Make sure that we get 1/1 correct so there is a grade to pass back in the first place.
//this one was randomized by default in the QTI import, so we have to hunt for the right answer.
describe('Taking a second graded quiz from QTI import', function() {
    var qcName = data.sets.featuresAllOn.quickchecks.qtiImportGraded;

    it('should show a successfully graded message after completion', function() {
        common.switchToCanvas().then(function() {
            canvasAssignmentsPage.goToAssignments();
            canvasAssignmentsPage.openAssignment(qcName);
            //refresh so we can test if empty attempts are actually hidden
            browser2.refresh();
         }).then(function() {
            common.switchToLtiTool();
         }).then(function() {
            common.enterAngularPage();
            //really doesn't matter what we select here, just pick the first one
            qcPage.getMcOptions().each(function(option, index) {
                option.getText().then(function(text) {
                    if (text.indexOf('B') > -1) {
                        qcPage.selectMcOptionByIndex(index);
                    }
                });
            });
         }).then(function() {
            qcPage.submit();
            qcPage.clickContinue();
            expect(qcPage.isQcFinished()).toBe(true);
            expect(qcPage.isQcGraded()).toBe(true);
         });
    });
});