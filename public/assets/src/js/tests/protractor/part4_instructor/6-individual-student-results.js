var includes = require('../common/includes.js'),
    data = includes.data,
    common = new includes.Common(browser),
    creds = includes.userCreds,
    attemptOverviewPage = new includes.AttemptOverviewPage(browser),
    studentResultsPage = new includes.StudentResultsPage(browser);

describe('Reviewing individual results from the attempts overview page', function() {
    it('should show a toggle for results by student', function() {
        expect(attemptOverviewPage.getStudentResultsToggle().isDisplayed()).toBe(true);
    });

    it('should default to showing results by quick check first', function() {
        expect(attemptOverviewPage.getAttempts().count()).toBe(6);
    });

    it('should list students when the toggle is on', function() {
        attemptOverviewPage.clickStudentToggle();
        expect(attemptOverviewPage.getStudents().count()).toBe(3);
    });

    it('should show results by quick check again when toggle is turned off', function() {
        attemptOverviewPage.clickStudentToggle();
        expect(attemptOverviewPage.getAttempts().count()).toBe(6);
    });

    it('should allow searching by last name', function() {
        attemptOverviewPage.clickStudentToggle();
        attemptOverviewPage.search(creds.student.last);
        expect(attemptOverviewPage.getStudents().count()).toBe(1);
    });

    it('should show all students', function() {
        attemptOverviewPage.clearSearch();
        expect(attemptOverviewPage.getStudents().get(0).getText()).toContain(creds.instructor.last);
        expect(attemptOverviewPage.getStudents().get(1).getText()).toContain(creds.student.last);
        expect(attemptOverviewPage.getStudents().get(2).getText()).toContain(creds.admin.last);
    });
})

describe('Viewing results for an individual student', function() {
    it('should show all quick checks attempted by the student', function() {
        attemptOverviewPage.getStudents().get(1).click();
        browser.sleep(2000); //wait for angular to load when moving to new page
        expect(studentResultsPage.getQuickChecks().count()).toBe(5);
    });

    it('should allow searching by quick check name', function() {
        studentResultsPage.search(data.sets.featuresAllOn.quickchecks.featuresAllOn);
        expect(studentResultsPage.getQuickChecks().count()).toBe(1);
        studentResultsPage.clearSearch();
    });

    it('should show attempt data when an accordion is opened', function() {
        studentResultsPage.toggleResults(0);
        expect(studentResultsPage.getAttemptTable().isDisplayed()).toBe(true);
    });

    it('should show accurate attempt data', function() {
        //test for count correct, count incorrect, and score on a completed, 100% attempt
        expect(studentResultsPage.attempts.getCorrect(2)).toBe('7');
        expect(studentResultsPage.attempts.getIncorrect(2)).toBe('0');
        expect(studentResultsPage.attempts.getScore(2)).toBe('100%')
    });

    it('should show accurate grade data', function() {
        expect(studentResultsPage.attempts.getEditGradeLink(0).getText()).toContain('100');
    });

    it('should show student responses', function() {
        //keep it cursory: just check that the number of responses listed is accurate
        studentResultsPage.attempts.getResponsesBtn(2).click();
        expect(studentResultsPage.responses.getQuestions().count()).toBe(7);
    });

    it('should show the due date if a due date is present', function() {
        studentResultsPage.responses.goBack();
        expect(studentResultsPage.getDueDate(0).getText()).toContain('12/30');
    });

    it('should not show the due date if a due date is not present', function() {
        studentResultsPage.toggleResults(0);
        studentResultsPage.toggleResults(1);
        expect(studentResultsPage.getDueDate(1).isPresent()).toBe(false);
    });
});

describe('Viewing analytics for an individual student', function() {
    it('should show total attempts', function() {
        studentResultsPage.viewAnalytics();
        expect(studentResultsPage.getTotalAttempts()).toBe('13');
    });

    it('should show average score', function() {
        expect(studentResultsPage.getAverageScore()).toBe('61.11%');
    });

    it('should show number of questions answered', function() {
        expect(studentResultsPage.getQuestionsAnswered()).toBe('22');
    });

    it('should show average number of retries', function() {
        expect(studentResultsPage.getAverageRetries()).toBe('1');
    });

    it('should show something intelligible for time analytics', function() {
        //we can't really know how long these are going to take, but we know it's on the
        //order of seconds, so just look for seconds in each of the place
        expect(studentResultsPage.getTotalTimeBeforeDueDate()).toContain('seconds');
        expect(studentResultsPage.getTotalTimeAfterDueDate()).toContain('seconds');
        expect(studentResultsPage.getTotalTimeOverall()).toContain('seconds');
        expect(studentResultsPage.getAverageTimeBeforeDueDate()).toContain('seconds');
        expect(studentResultsPage.getAverageTimeAfterDueDate()).toContain('seconds');
        expect(studentResultsPage.getAverageTimeOverall()).toContain('seconds');
        studentResultsPage.nav.goToSets();
    });
});
