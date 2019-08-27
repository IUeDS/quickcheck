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

    async function clearSearch() {
        await page.searchBox.clear();
    }

    function getAttemptTable() {
        return page.attemptTable;
    }

    async function getAverageRetries() {
        return await page.averageRetries.getText();
    }

    async function getAverageScore() {
        return await page.averageScore.getText();
    }

    async function getAverageTimeAfterDueDate() {
        return await page.averageTimeAfterDueDate.getText();
    }

    async function getAverageTimeBeforeDueDate() {
        return await page.averageTimeBeforeDueDate.getText();
    }

    async function getAverageTimeOverall() {
        return await page.averageTimeOverall.getText();
    }

    function getDueDate(index) {
        return page.getQuickChecks().get(index).element(by.css(page.dueDate));
    }

    async function getQuestionsAnswered() {
        return await page.questionsAnswered.getText();
    }

    function getQuickChecks() {
        return page.quickChecks;
    }

    async function getTotalAttempts() {
        return await page.totalAttempts.getText();
    }

    async function getTotalTimeAfterDueDate() {
        return await page.totalTimeAfterDueDate.getText();
    }

    async function getTotalTimeBeforeDueDate() {
        return await page.totalTimeBeforeDueDate.getText();
    }

    async function getTotalTimeOverall() {
        return await page.totalTimeOverall.getText();
    }

    async function search(text) {
        await page.searchBox.sendKeys(text);
    }

    async function toggleResults(index) {
        await page.quickChecks.get(index).element(by.css(page.resultsAccordionHeaderClass)).click();
    }

    async function viewAnalytics() {
        await page.analyticsBtn.click();
    }
}

module.exports = StudentResultsPage;