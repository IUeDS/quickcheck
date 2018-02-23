var StudentResultsPage = function(browserRef) {
    var page = this;
    page.browser = browserRef;
    page.includes = require('../common/includes.js');

    //sub-components
    page.attempts = new page.includes.AttemptsTableComponent(page.browser);
    page.nav = new page.includes.NavComponent(page.browser);
    page.responses = new page.includes.ResponsesComponent(page.browser);

    //elements
    page.analyticsBtn = page.browser.element(by.css('.qc-btn-analytics'));
    page.attemptTable = page.browser.element(by.css('.qc-attempts-table'));
    page.averageRetries = page.browser.element(by.css('.qc-student-analytics-avg-retries'));
    page.averageScore = page.browser.element(by.css('.qc-student-analytics-avg-score'));
    page.averageTimeAfterDueDate = page.browser.element(by.css('.qc-student-analytics-avg-time-after-due'));
    page.averageTimeBeforeDueDate = page.browser.element(by.css('.qc-student-analytics-avg-time-before-due'));
    page.averageTimeOverall = page.browser.element(by.css('.qc-student-analytics-avg-time'));
    page.questionsAnswered = page.browser.element(by.css('.qc-student-analytics-total-questions'));
    page.quickChecks = page.browser.element.all(by.repeater('assessment in vm.displayedAssessments'));
    page.searchBox = page.browser.element(by.css('.qc-search-box'));
    page.totalAttempts = page.browser.element(by.css('.qc-student-analytics-total-attempts'));
    page.totalTimeAfterDueDate = page.browser.element(by.css('.qc-student-analytics-time-after-due'));
    page.totalTimeBeforeDueDate = page.browser.element(by.css('.qc-student-analytics-time-before-due'));
    page.totalTimeOverall = page.browser.element(by.css('.qc-student-analytics-total-time'));

    //sub-string selectors
    page.dueDate = '.qc-due-at';
    page.resultsAccordionHeaderClass = '.qc-student-attempts-panel-heading';

    //functions
    page.clearSearch = clearSearch;
    page.getAttemptTable = getAttemptTable;
    page.getAverageRetries = getAverageRetries;
    page.getAverageScore = getAverageScore;
    page.getAverageTimeAfterDueDate = getAverageTimeAfterDueDate;
    page.getAverageTimeBeforeDueDate = getAverageTimeBeforeDueDate;
    page.getAverageTimeOverall = getAverageTimeOverall;
    page.getDueDate = getDueDate;
    page.getQuestionsAnswered = getQuestionsAnswered;
    page.getQuickChecks = getQuickChecks;
    page.getTotalAttempts = getTotalAttempts;
    page.getTotalTimeAfterDueDate = getTotalTimeAfterDueDate;
    page.getTotalTimeBeforeDueDate = getTotalTimeBeforeDueDate;
    page.getTotalTimeOverall = getTotalTimeOverall;
    page.search = search;
    page.toggleResults = toggleResults;
    page.viewAnalytics = viewAnalytics;

    function clearSearch() {
        page.searchBox.clear();
    }

    function getAttemptTable() {
        return page.attemptTable;
    }

    function getAverageRetries() {
        return page.averageRetries.getText();
    }

    function getAverageScore() {
        return page.averageScore.getText();
    }

    function getAverageTimeAfterDueDate() {
        return page.averageTimeAfterDueDate.getText();
    }

    function getAverageTimeBeforeDueDate() {
        return page.averageTimeBeforeDueDate.getText();
    }

    function getAverageTimeOverall() {
        return page.averageTimeOverall.getText();
    }

    function getDueDate(index) {
        return page.getQuickChecks().get(index).element(by.css(page.dueDate));
    }

    function getQuestionsAnswered() {
        return page.questionsAnswered.getText();
    }

    function getQuickChecks() {
        return page.quickChecks;
    }

    function getTotalAttempts() {
        return page.totalAttempts.getText();
    }

    function getTotalTimeAfterDueDate() {
        return page.totalTimeAfterDueDate.getText();
    }

    function getTotalTimeBeforeDueDate() {
        return page.totalTimeBeforeDueDate.getText();
    }

    function getTotalTimeOverall() {
        return page.totalTimeOverall.getText();
    }

    function search(text) {
        page.searchBox.sendKeys(text);
    }

    function toggleResults(index) {
        page.quickChecks.get(index).element(by.css(page.resultsAccordionHeaderClass)).click();
    }

    function viewAnalytics() {
        page.analyticsBtn.click();
    }
}

module.exports = StudentResultsPage;