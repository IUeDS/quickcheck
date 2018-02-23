var AttemptsPage = function(browserRef) {
    var page = this;
    page.browser = browserRef;
    page.includes = require('../common/includes.js');

    //subcomponents
    page.analytics = new page.includes.AnalyticsComponent(page.browser);
    page.attempts = new page.includes.AttemptsTableComponent(page.browser);
    page.customResponses = new page.includes.CustomResponsesComponent(page.browser);
    page.nav = new page.includes.NavComponent(page.browser);
    page.responses = new page.includes.ResponsesComponent(page.browser);

    //elements
    page.analyticsBtn = page.browser.element(by.partialButtonText('View Analytics'));
    page.autoGradeBtn = page.browser.element(by.css('.qc-autograde-btn'));
    page.dueDate = page.browser.element(by.css('.qc-due-at'));
    page.goBackLink = page.browser.element(by.partialLinkText('Back'));
    page.gradingMessage = page.browser.element(by.css('.qc-graded-message'));
    page.releaseBtn = page.browser.element(by.css('.qc-release-btn'));
    page.releaseSuccess = page.browser.element(by.css('.release-alert'));
    page.searchBox = page.browser.element(by.css('.qc-search-box'));
    page.toggleUngradedCheckbox = page.browser.element(by.css('.ungraded-checkbox'));

    //sub-string selectors
    page.releaseText = 'RELEASE RESULTS';
    page.rollbackText = 'ROLLBACK RELEASED RESULTS';

    //functions
    page.autoGrade = autoGrade;
    page.clearSearch = clearSearch;
    page.getDueDate = getDueDate;
    page.getGradingMessage = getGradingMessage;
    page.getReleaseSuccess = getReleaseSuccess;
    page.goBack = goBack;
    page.isReleaseBtnDisplayed = isReleaseBtnDisplayed;
    page.isRollbackBtnDisplayed = isRollbackBtnDisplayed;
    page.search = search;
    page.toggleRelease = toggleRelease;
    page.toggleUngraded = toggleUngraded;
    page.viewAnalytics = viewAnalytics;

    function autoGrade() {
        page.autoGradeBtn.click();
    }

    function clearSearch() {
        page.searchBox.clear();
    }

    function getDueDate() {
        return page.dueDate;
    }

    function getGradingMessage() {
        return page.gradingMessage.getText();
    }

    function getReleaseSuccess() {
        return page.releaseSuccess;
    }

    function goBack() {
        page.goBackLink.click();
        page.browser.sleep(1000);
    }

    function isReleaseBtnDisplayed() {
        return page.releaseBtn.getText().then(function(text) {
            if (text.indexOf(page.releaseText) > -1) {
                return true;
            }
            else {
                return false;
            }
        });
    }

    function isRollbackBtnDisplayed() {
        return page.releaseBtn.getText().then(function(text) {
            if (text.indexOf(page.rollbackText) > -1) {
                return true;
            }
            else {
                return false;
            }
        });
    }

    function search(text) {
        page.searchBox.sendKeys(text);
    }

    function toggleRelease() {
        page.releaseBtn.click();
    }

    function toggleUngraded() {
        page.toggleUngradedCheckbox.click();
    }

    function viewAnalytics() {
        page.analyticsBtn.click();
    }
}

module.exports = AttemptsPage;