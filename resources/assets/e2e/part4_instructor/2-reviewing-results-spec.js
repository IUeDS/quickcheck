var includes = require('../common/includes.js'),
    data = includes.data,
    common = new includes.Common(browser),
    creds = includes.userCreds,
    attemptOverviewPage = new includes.AttemptOverviewPage(browser),
    attemptsPage = new includes.AttemptsPage(browser);

//take a look at quiz #1
describe('Viewing attempts for an assessment', function() {
    var attempts;

    //navigate to first quiz
    it('should hide empty attempts when that feature is turned on', function() {
        //there should only be 2 attempts with responses
        expect(attemptsPage.attempts.getAttempts().count()).toBe(2);
    });

    //NOTE: some things we can't really test, like exact timestamps for start/finish
    it('should show the proper correct counts for all attempts', function() {
        var correctCounts = [ '0', '7' ];

        correctCounts.forEach(function(correctCount, index) {
            expect(attemptsPage.attempts.getCorrect(index)).toBe(correctCounts[index]);
        });
    });

    it('should show the proper incorrect counts for all attempts', function() {
        var incorrectCounts = [ '7', '0' ];

        incorrectCounts.forEach(function(incorrectCount, index) {
            expect(attemptsPage.attempts.getIncorrect(index)).toBe(incorrectCounts[index]);
        });
    });

    it('should show the proper score for all attempts', function() {
        var scores = [ '0%', '100%' ];

        scores.forEach(function(score, index) {
            expect(attemptsPage.attempts.getScore(index)).toBe(scores[index]);
        });
    });

    it('should show the complete checkmark for finished attempts', function() {
        var isCompletes = [ true, true ];

        isCompletes.forEach(function(isComplete, index) {
            expect(attemptsPage.attempts.isCompleted(index)).toBe(isCompletes[index]);
        });
    });

    it('should not show the past due icon if the attempt was completed before the due date', function() {
        var i;

        for(i = 0; i < 2; i++) {
            expect(attemptsPage.attempts.isPastDue(i)).toBe(false);
        }
    });

    it('should show the student name in the first row but not for any subsequent attempts', function() {
        var name = creds.student.last + ', ' + creds.student.first;

        expect(attemptsPage.attempts.getName(0)).toBe(name);
        expect(attemptsPage.attempts.getName(1)).toBe('');
    });

    it('should show a grade for the student if automatic grade passback is enabled', function() {
        expect(attemptsPage.attempts.getEditGradeLink(0).isPresent()).toBe(true);
    });

    it('should only show a grade in the first row but not for any subsequent attempts', function() {
        expect(attemptsPage.attempts.isEditGradePresent(1)).toBe(false);
    });

    it('should show the higher of the student grades if multiple attempts were made', function() {
        expect(attemptsPage.attempts.getEditGradeLink(0).getText()).toContain('100');
    });

    it('should show the due date if one is present', function() {
        expect(attemptsPage.getDueDate().getText()).toContain('12/30');
    });
});

describe('Viewing responses for an attempt', function() {
    //the responses view is a directive that is the exact same in both student and instructor view, and since we
    //already tested in-depth in the student view, there's no need to re-do that here. However, we do want to make
    //sure that the correct data is getting passed in (i.e., are we receiving correct number of questions/responses
    //from the back-end?), so let's run a quick test to make sure the correct number of questions are here and that
    //there are no errors listed that a student response was not correctly marked.
    it('should not show a responses table', function() {
        attemptsPage.attempts.getResponsesBtn(0).click();
        expect(attemptsPage.customResponses.isResponseTable()).toBe(false);
    });

    it('should show the correct number of questions', function() {
        expect(attemptsPage.responses.getQuestions().count()).toBe(7);
    });

    it('should not show any errors from student responses not matching the question options', function() {
        expect(attemptsPage.responses.getResponseErrors().count()).toBe(0);
    });
});

describe('Viewing past due assignments', function() {
    //since quiz 3 was past due and had hide empty attempts feature turned off, navigate there
    it('should show the past due icon if the attempt was completed after the due date', function() {
        var i,
            assessmentName = data.sets.featuresAllOff.quickchecks.featuresAllOffPastDue;

        attemptsPage.responses.goBack();
        attemptsPage.goBack();
        attemptOverviewPage.getAssessmentByName(assessmentName).click();
        browser.sleep(1000);

        for(i = 0; i < 3; i++) {
            expect(attemptsPage.attempts.isPastDue(i)).toBe(true);
        }
    });
});

//continuing with quiz #3
describe('Viewing attempts when the feature to hide empty attempts is turned off', function() {
    var emptyAttempt = 1;

    it('should show empty attempts', function() {
        expect(attemptsPage.attempts.getAttempts().count()).toBe(6);
        expect(attemptsPage.attempts.getCorrect(emptyAttempt)).toBe('0');
        expect(attemptsPage.attempts.getIncorrect(emptyAttempt)).toBe('0');
    });

    //since our other tests only focused on making sure the checkmark for completion WAS there, let's make sure that
    //it doesn't appear when it shouldn't be there
    it('should not list empty attempts as being complete', function() {
        var assessmentName = data.sets.featuresAllOn.quickchecks.featuresAllOn;
        expect(attemptsPage.attempts.isCompleted(emptyAttempt)).toBe(false);
        //set up for next test
        attemptsPage.goBack();
        attemptOverviewPage.getAssessmentByName(assessmentName).click();
        browser.sleep(1000);
    });
});