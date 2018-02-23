var AttemptOverviewPage = function(browserRef) {
    var page = this;
    page.browser = browserRef;

    //elements
    page.attempts = page.browser.element.all(by.repeater('attempt in vm.attempts'));
    page.searchBox = page.browser.element(by.css('.qc-search-box'));
    page.studentResultsToggle = page.browser.element(by.css('.qc-student-results-toggle label'));
    page.students = page.browser.element.all(by.repeater('student in vm.students'));

    //sub-string selectors

    //functions
    page.clearSearch = clearSearch;
    page.clickStudentToggle = clickStudentToggle;
    page.getAssessmentByName = getAssessmentByName;
    page.getAttempts = getAttempts;
    page.getStudentResultsToggle = getStudentResultsToggle;
    page.getStudents = getStudents;
    page.search = search;

    function clearSearch() {
        page.searchBox.clear();
    }

    function clickStudentToggle() {
        page.studentResultsToggle.click();
    }

    function getAssessmentByName(nameText) {
        return page.browser.element(by.partialLinkText(nameText));
    }

    function getAttempts() {
        return page.attempts;
    }

    function getStudentResultsToggle() {
        return page.studentResultsToggle;
    }

    function getStudents() {
        return page.students;
    }

    function search(text) {
        page.searchBox.sendKeys(text);
    }
}

module.exports = AttemptOverviewPage;