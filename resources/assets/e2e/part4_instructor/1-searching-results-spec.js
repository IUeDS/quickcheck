var includes = require('../common/includes.js'),
    data = includes.data,
    common = new includes.Common(browser),
    creds = includes.userCreds,
    attemptOverviewPage = new includes.AttemptOverviewPage(browser),
    attemptsPage = new includes.AttemptsPage(browser),
    viewSetsPage = new includes.ViewSetsPage(browser),
    setPage = new includes.SetPage(browser);

describe('Searching for sets', function() {
    var searchBox = viewSetsPage.getSearchBox();

    it('should show all sets initially', function() {
        expect(viewSetsPage.getMembershipTiles().count()).toBe(2);
    });

    it('should filter sets regardless of case', function() {
        searchBox.sendKeys(data.sets.featuresAllOn.name.toUpperCase());
        expect(viewSetsPage.getMembershipTiles().count()).toBe(1);
    });

    it('should not show any sets if the text does not match', function() {
        searchBox.sendKeys('extra text');
        expect(viewSetsPage.getMembershipTiles().count()).toBe(0);
    });

    it('should show all sets again after the search text has been erased', function() {
        searchBox.clear();
        expect(viewSetsPage.getMembershipTiles().count()).toBe(2);
    });
});

describe('Searching inside a set', function() {
    var searchBox;

    it('should show quick check names that match the search', function() {
        var membershipTile = viewSetsPage.getMembershipTiles().first(),
            assessmentName = data.sets.featuresAllOn.quickchecks.featuresAllOn,
            assessmentResults;

        viewSetsPage.getGoToSetBtn(membershipTile).click();
        browser.sleep(1000);
        searchBox = setPage.getSearchBox();
        searchBox.sendKeys(assessmentName);
        assessmentResults = setPage.getSearchAssessmentResults();
        expect(assessmentResults.count()).toBe(1);
        expect(assessmentResults.first().getText()).toContain(assessmentName);
        expect(setPage.getSearchQuestionResults().count()).toBe(0);
    });

    it('should show questions that match the search', function() {
        var assessmentName = data.sets.featuresAllOn.quickchecks.featuresAllOn,
            questionText = data.quizData.quiz1.question1.questionText,
            assessmentResults,
            questionResults;

        searchBox.clear();
        searchBox.sendKeys(questionText);
        //funnily enough, didn't realize that "answer is B" is also contained
        //in one of the QTI import questions!
        assessmentResults = setPage.getSearchAssessmentResults();
        questionResults = setPage.getSearchQuestionResults();
        expect(assessmentResults.count()).toBe(2);
        expect(assessmentResults.get(0).getText()).toContain(assessmentName);
        expect(questionResults.count()).toBe(2);
        expect(questionResults.get(0).getText()).toContain('Question #1')
    });

    it('should show answer options that match the search', function() {
        var optionText = 'parmesan', //only included in an answer option for QTI import #1
            assessmentName = data.sets.featuresAllOn.quickchecks.qtiImportUngraded,
            assessmentResults,
            questionResults;

        searchBox.clear();
        searchBox.sendKeys(optionText);
        assessmentResults = setPage.getSearchAssessmentResults();
        questionResults = setPage.getSearchQuestionResults();
        expect(assessmentResults.count()).toBe(1);
        expect(assessmentResults.get(0).getText()).toContain(assessmentName);
        expect(questionResults.count()).toBe(1);
        expect(questionResults.get(0).getText()).toContain('Question #4');
    });

    it('should show feedback that matches the search', function() {
        var feedbackText = data.quizData.quiz1.question3.feedbackIncorrect,
            assessmentName = data.sets.featuresAllOn.quickchecks.featuresAllOn,
            assessmentResults,
            questionResults;

        searchBox.clear();
        searchBox.sendKeys(feedbackText);
        assessmentResults = setPage.getSearchAssessmentResults();
        questionResults = setPage.getSearchQuestionResults();
        expect(assessmentResults.count()).toBe(1);
        expect(assessmentResults.get(0).getText()).toContain(assessmentName);
        expect(questionResults.count()).toBe(1);
        expect(questionResults.get(0).getText()).toContain('Question #3');
    });

    it('should show no results if there is no match', function() {
        searchBox.clear();
        searchBox.sendKeys('european swallow');
        expect(setPage.getSearchAssessmentResults().count()).toBe(0);
        expect(setPage.getSearchQuestionResults().count()).toBe(0);
    });
});

describe('Searching for attempts by quick check name', function() {
    it('should show all quizzes initially', function() {
        setPage.nav.goToResults();
        expect(attemptOverviewPage.getAttempts().count()).toBe(6);
    });

    it('should filter quizzes regardless of case', function() {
        attemptOverviewPage.search(data.sets.featuresAllOn.quickchecks.featuresAllOn.toUpperCase());
        expect(attemptOverviewPage.getAttempts().count()).toBe(1);
    });

    it('should not show any quizzes if the text does not match', function() {
        attemptOverviewPage.clearSearch();
        attemptOverviewPage.search('Knights who say ne');
        expect(attemptOverviewPage.getAttempts().count()).toBe(0);
    });

    it('should show all quizzes again after the search text has been erased', function() {
        attemptOverviewPage.clearSearch();
        expect(attemptOverviewPage.getAttempts().count()).toBe(6);
    });
});

describe('Searching attempts by name', function() {
    it('should filter attempts by last name when searched', function() {
        var assessmentName = data.sets.featuresAllOn.quickchecks.featuresAllOn;
        attemptOverviewPage.getAssessmentByName(assessmentName).click();
        browser.sleep(1000);
        attemptsPage.search(creds.student.last);
        expect(attemptsPage.attempts.getAttemptsVisible().count()).toBe(2);
    });

    it('should not show any attempts if the last name text does not match', function() {
        attemptsPage.clearSearch();
        attemptsPage.search('Gandalf');
        expect(attemptsPage.attempts.getAttemptsVisible().count()).toBe(0);
    });

    it('should show all attempts again after the search text has been erased', function() {
        attemptsPage.clearSearch();
        expect(attemptsPage.attempts.getAttemptsVisible().count()).toBe(2);
    });
});
