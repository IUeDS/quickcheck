var AttemptOverviewPage = function(browserRef) {
    var page = this,
        EC = protractor.ExpectedConditions;
    page.browser = browserRef;

    //elements
    page.attempts = page.browser.element.all(by.css('.qc-attempt-overview-assessment'));
    page.searchBox = page.browser.element(by.css('.qc-search-box'));
    page.studentResultsToggle = page.browser.element(by.css('.qc-student-results-toggle label'));
    page.studentResultsToggleInput = page.browser.element(by.css('.qc-student-results-toggle input'));
    page.students = page.browser.element.all(by.css('.qc-attempt-overview-student'));

    //sub-string selectors

    //functions
    page.clearSearch = clearSearch;
    page.clickStudentToggle = clickStudentToggle;
    page.getAssessmentByName = getAssessmentByName;
    page.getAttempts = getAttempts;
    page.getStudentResultsToggle = getStudentResultsToggle;
    page.getStudents = getStudents;
    page.isStudentToggleEnabled = isStudentToggleEnabled;
    page.search = search;

    async function clearSearch() {
        await page.searchBox.clear();
        //9/26/19: apparently clear() was not enough to trigger the angular model! so frustrating!
        //seems to waiting for some sort of keyup stroke or something that isn't triggered by selenium
        await page.searchBox.sendKeys('a');
        await page.searchBox.sendKeys(protractor.Key.BACK_SPACE);
    }

    async function clickStudentToggle() {
        await page.studentResultsToggle.click();
    }

    function getAssessmentByName(nameText) {
        return page.browser.element(by.partialLinkText(nameText));
    }

    function getAttempts() {
        return page.attempts;
    }

    async function getStudentResultsToggle() {
        await page.browser.wait(EC.presenceOf(page.studentResultsToggle), 5000);
        return page.studentResultsToggle;
    }

    function getStudents() {
        return page.students;
    }

    async function isStudentToggleEnabled() {
        return await page.studentResultsToggleInput.getAttribute('checked');
    }

    async function search(text) {
        await page.searchBox.sendKeys(text);
    }
}

module.exports = AttemptOverviewPage;