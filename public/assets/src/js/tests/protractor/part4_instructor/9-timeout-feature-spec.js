var includes = require('../common/includes.js'),
    data = includes.data,
    canvasAssignmentsPage = new includes.CanvasAssignmentsPage(browser),
    common = new includes.Common(browser),
    qcPage = new includes.QcPage(browser),
    EC = protractor.ExpectedConditions;

describe('Taking an assessment with the timeout feature turned on', function() {
    it('should not show a timeout message initially', function() {
        common.switchToCanvas().then(function() {
            canvasAssignmentsPage.goToStudentView();
            canvasAssignmentsPage.goToAssignments();
            canvasAssignmentsPage.openAssignment(data.sets.featuresAllOn.quickchecks.featuresAllOn);
            common.switchToLtiTool().then(function() {
                common.enterAngularPage();
                expect(qcPage.getTimeoutModal().isDisplayed()).toBe(false);
            });
        });
    });

    it('should not include page views as part of the attempt count', function() {
        qcPage.selectMcOptionByIndex(0);
        qcPage.submit();
        qcPage.clickContinue();
        browser.sleep(500); //wait for modal to disappear
        qcPage.startOver();
        qcPage.startOver();
        expect(qcPage.getTimeoutModal().isDisplayed()).toBe(false);
    });

    it('should show a timeout message after two attempts with at least one response', function() {
        qcPage.selectMcOptionByIndex(0);
        qcPage.submit();
        qcPage.clickContinue();
        browser.sleep(500); //wait for modal to disappear
        qcPage.startOver();
        browser.wait(EC.presenceOf(qcPage.getTimeoutModal()), 5000);
        expect(qcPage.getTimeoutModal().isDisplayed()).toBe(true);
    });

    it('should show a timer', function() {
        expect(qcPage.getTimeoutTimer().isDisplayed()).toBe(true);
    });

    it('should show the timeout message still if refreshed', function() {
        common.switchToCanvas().then(function() {
            browser.refresh().then(function() {
                common.switchToLtiTool().then(function() {
                    common.enterAngularPage();
                    expect(qcPage.getTimeoutModal().isDisplayed()).toBe(true);
                });
            });
        });
    });

    it('should show a restart button after the timeout completes', function() {
        //timeout length set as 20 seconds in env
        browser.sleep(20000);
        expect(qcPage.getTimeoutRestartBtn().isDisplayed()).toBe(true);
    });

    it('should not show a timeout when refreshed after timeout period ends', function() {
        qcPage.getTimeoutRestartBtn().click();
        browser.sleep(1000);
        expect(qcPage.getTimeoutModal().isDisplayed()).toBe(false);
    });

    it('should not be in effect with instructors, when a grade is not involved', function() {
        var attemptCount;

        //leave student view; if a question is answered and restarted twice, should be in timeout zone
        common.switchToCanvas().then(function() {
            common.leaveStudentView();
            browser.sleep(1000);
            common.switchToLtiTool().then(function() {
                common.enterAngularPage();
                for (attemptCount = 0; attemptCount < 2; attemptCount++) {
                    qcPage.selectMcOptionByIndex(0);
                    qcPage.submit();
                    qcPage.clickContinue();
                    browser.sleep(500); //wait for modal to disappear
                    qcPage.startOver();
                }
                expect(qcPage.getTimeoutModal().isDisplayed()).toBe(false);
            });
        });
    });
});
