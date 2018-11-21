var includes = require('../common/includes.js'),
    data = includes.data,
    common = new includes.Common(browser),
    attemptOverviewPage = new includes.AttemptOverviewPage(browser),
    attemptsPage = new includes.AttemptsPage(browser);

//take a look at quiz #3
describe('Toggling ungraded assessments', function() {
    //should show the student's attempt but hide the instructor's attempt, since instructor grade is NA
    it('should only show ungraded assignments and hide graded or NA assignments', function() {
        var attemptsVisible,
            assessmentName = data.sets.featuresAllOff.quickchecks.featuresAllOffPastDue;

        attemptOverviewPage.getAssessmentByName(assessmentName).click();
        browser.sleep(1000);

        attemptsVisible = attemptsPage.attempts.getAttemptsVisible();
        expect(attemptsVisible.count()).toBe(6);
        attemptsPage.toggleUngraded();
        expect(attemptsVisible.count()).toBe(5);
        attemptsPage.toggleUngraded();
        expect(attemptsVisible.count()).toBe(6);
    });
});

describe('Grading an assessment', function() {
    var attemptIndex = 1,
        displayedGrade,
        gradeInput = attemptsPage.attempts.getGradeInput(attemptIndex);

    it('should show an empty input for grade if the assignment is ungraded', function() {
        expect(gradeInput.isDisplayed()).toBe(true);
    });

    it('should throw an error if no grade is entered', function() {
        attemptsPage.attempts.submitGrade(attemptIndex);
        expect(attemptsPage.attempts.getGradeError(attemptIndex).getText()).toContain('The grade must be a number');
    });

    it('should show the correct grade after it has been entered using a 0-100 grading scale', function() {
        gradeInput.sendKeys('100');
        attemptsPage.attempts.submitGrade(attemptIndex);
        displayedGrade = attemptsPage.attempts.getEditGradeLink(attemptIndex);
        expect(displayedGrade.getText()).toContain('100');
    });

    it('should hide the grade input and remove previous error after a successful submission', function() {
        expect(gradeInput.isDisplayed()).toBe(false);
        expect(attemptsPage.attempts.getGradeError(attemptIndex).isPresent()).toBe(false);
    });

    it('should show the grade input when the grade is edited', function() {
        displayedGrade.click();
        expect(gradeInput.isDisplayed()).toBe(true);
    });

    it('should autofill the current grade in the text input when editing', function() {
        expect(gradeInput.getAttribute('value')).toBe('100');
    });

    it('should correctly change the grade when it has been edited using a 1-100 grading scale', function() {
        gradeInput.clear().sendKeys('1');
        attemptsPage.attempts.submitGrade(attemptIndex);
        expect(displayedGrade.getText()).toContain('1');
        //make sure the 1 is not converted as a decimal to 100, which our system used to do
        expect(displayedGrade.getText()).not.toContain('100');
    });

    it('should accept float values between 1-100', function() {
        displayedGrade.click();
        gradeInput.clear().sendKeys('33.97');
        attemptsPage.attempts.submitGrade(attemptIndex);
        expect(displayedGrade.getText()).toContain('33.97');
    });

    it('should accept a grade of 0', function() {
        displayedGrade.click();
        gradeInput.clear().sendKeys('0');
        attemptsPage.attempts.submitGrade(attemptIndex);
        expect(displayedGrade.getText()).toContain('0');
        attemptsPage.goBack();
    });
});

//take a look at quiz #4
describe('Auto-grading an assessment', function() {
    it('should give a grade corresponding to a student\'s calculated score', function() {
        var attemptIndex = 1,
            assessmentName = data.sets.featuresAllOff.quickchecks.resultsNotReleased;

        attemptOverviewPage.getAssessmentByName(assessmentName).click();
        browser.sleep(2000);
        attemptsPage.autoGrade();
        expect(attemptsPage.attempts.getEditGradeLink(attemptIndex).getText()).toContain('0');
        attemptsPage.nav.goToResults();
    });
});