var browser3 = browser.params.browser3, //define browser instance from global value
    includes = require('../common/includes.js'),
    common = new includes.Common(browser3),
    data = includes.data,
    attemptOverviewPage = new includes.AttemptOverviewPage(browser3),
    attemptsPage = new includes.AttemptsPage(browser3),
    canvasAssignmentsPage = new includes.CanvasAssignmentsPage(browser3),
    editQcPage = new includes.EditQcPage(browser3),
    embedPage = new includes.EmbedPage(browser3),
    homePage = new includes.HomePage(browser3),
    setPage = new includes.SetPage(browser3),
    viewSetsPage = new includes.ViewSetsPage(browser3);

describe('Making a quick check a custom activity', function() {
    var customData = data.customActivity;

    it('should show the button to make it a custom activity before questions are added', function() {
        var set,
            subset,
            quickcheck;

        viewSetsPage.toggleAdminViewAllSets();
        set = viewSetsPage.getAdminSetTiles().get(0); //add to a set the instructor can access for testing
        viewSetsPage.getGoToSetBtn(set).click();
        browser3.sleep(1000);
        setPage.initSubsets().then(function() {
            subset = setPage.getSubset(0);
            subset.addAndSaveQuickCheck(data.sets.featuresAllOn.quickchecks.custom);
            quickcheck = subset.getQuickChecks().last();
            subset.editQuickCheck(quickcheck);
            expect(editQcPage.getCustomBtn().isDisplayed()).toBe(true);
        });

    });

    it('should hide the button to make it a custom activity after a question has been added', function() {
        editQcPage.addQuestion(data.questionTypes.mc);
        expect(editQcPage.getCustomBtn().isPresent()).toBe(false);
    });

    it('should show the button again after the question has been deleted', function() {
        editQcPage.getQuestion(0).deleteQuestion();
        expect(editQcPage.getCustomBtn().isDisplayed()).toBe(true);
    });

    it('should show the proper form when the button is clicked', function() {
        editQcPage.getCustomBtn().click();
        expect(editQcPage.getCustomDropdown().isDisplayed()).toBe(true);
    });

    it('should show a list of all custom activities in the dropdown', function() {
        var customActivities = editQcPage.getCustomActivities();
        expect(customActivities.count()).toBe(1);
        expect(customActivities.get(0).getText()).toBe(customData.name);
    });

    it('should display the custom activity information when one is selected from the dropdown', function() {
        var customDropdown = editQcPage.getCustomDropdown();
        customDropdown.sendKeys(customData.name);
        expect(editQcPage.getCustomName()).toContain(customData.name);
    });

    it('should delete the custom activity when the delete button is clicked', function() {
        editQcPage.deleteCustom();
        expect(editQcPage.getCustomBtn().isDisplayed()).toBe(true);
    });

    it('should keep the custom activity information when the quick check is saved', function() {
        //re-add it and save
        editQcPage.getCustomBtn().click();
        editQcPage.getCustomDropdown().sendKeys(customData.name);
        editQcPage.save();
        expect(editQcPage.getSaveSuccess().isDisplayed()).toBe(true);
        expect(editQcPage.getCustomName()).toContain(customData.name);
    });

    it('should show the proper custom activity when previewing', function() {
        var subset,
            quickcheck;

        editQcPage.goBackToSet();
        setPage.initSubsets().then(function() {
            subset = setPage.getSubset(0);
            quickcheck = subset.getQuickChecks().last();
            subset.previewQuickCheck(quickcheck);
            common.enterNonAngularPage();
            common.switchTab(1);
            expect(browser3.driver.getCurrentUrl()).toContain(customData.url);
        });
    });
});


describe('Embedding and taking a custom activity', function() {
    var customData = data.customActivity;
    it('should only show personal memberships for admins in the select panel at first', function() {

        browser3.close();
        common.switchTab(0);
        canvasAssignmentsPage.createAssignmentAndOpenEmbed(customData.name, '1').then(function() {
            common.enterAngularPage();
            expect(embedPage.getSets().count()).toBe(1);
        });
    });

    it('should show all sets in the system for admins in the select panel after toggling', function() {
        embedPage.toggleAdminViewAll();
        expect(embedPage.getAdminSets().count()).toBe(3);
    });

    it('should show a custom icon next to the activity in the embed window', function() {
        var quickcheck = embedPage.getQuickChecks().get(0);
        expect(quickcheck.getText()).toContain('Custom');

        //embed
        embedPage.selectQuickCheckByIndex(0);
        common.switchToCanvas().then(function() {
            canvasAssignmentsPage.saveEmbed();
            common.switchToLtiTool();
        });
    });

    it('should show the correct custom activity', function() {
        //tried getting the url, but was referencing parent iframe. Instead, just check for a class we know is in the activity.
        expect(browser3.driver.findElement(by.className('question_area')).isDisplayed()).toBe(true);
    });

    it('should allow answering 1 correct question and 1 incorrect question', function() {
        // we're using the P101 brain drag and drop custom activity; no need to make this object-oriented, not reusable
        // drag and drop: http://stackoverflow.com/questions/25664551/how-to-simulate-a-drag-and-drop-action-in-protractor
        questionBox = browser3.driver.findElement(by.className('question_area'));
        answerArea = browser3.driver.findElement(by.css('.label_dropzone[data-label="Cerebellum"]'));
        browser3.driver.actions().dragAndDrop(questionBox,answerArea).mouseUp().perform();
        browser3.driver.sleep(500);
        submitBtn = browser3.driver.findElement(by.css('.submit_response'));
        submitBtn.click();
        browser3.driver.sleep(1000);
        nextBtn = browser3.driver.findElement(by.css('.btn.next'));
        nextBtn.click();
        browser3.driver.sleep(1000);
        browser3.driver.actions().dragAndDrop(questionBox,answerArea).mouseUp().perform();
        browser3.driver.sleep(500);
        submitBtn.click();
        browser3.driver.sleep(500);
        browser3.driver.switchTo().defaultContent();
        common.goToQuickCheck();
    });

    it('should show the attempt data correctly in the results view', function() {
        var assessmentName = data.sets.featuresAllOn.quickchecks.custom;

        common.enterAngularPage();
        homePage.nav.goToResults();
        attemptOverviewPage.getAssessmentByName(assessmentName).click();
        browser3.sleep(1000);
        expect(attemptsPage.attempts.getCorrect(0)).toBe('1');
        expect(attemptsPage.attempts.getIncorrect(0)).toBe('1');
        expect(attemptsPage.attempts.getScore(0)).toBe('10%');
    });

    it('should show a responses table in the results view', function() {
        attemptsPage.attempts.getResponsesBtn(0).click();
        expect(attemptsPage.customResponses.isResponseTable()).toBe(true);
    });

    it('should correctly show the response data in the results view', function() {
        var responses = attemptsPage.customResponses; //for easier typing

        expect(responses.getQuestion(0)).toBe('This region allows you to balance while riding a bicycle.');
        expect(responses.getAnswer(0)).toBe('Cerebellum');
        expect(responses.getAnswerKey(0)).toBe('Cerebellum');
        expect(responses.isCorrect(0)).toBe(true);
        expect(responses.getQuestion(1)).toBe('This region is almost entirely dedicated to vision.');
        expect(responses.getAnswer(1)).toBe('Cerebellum');
        expect(responses.getAnswerKey(1)).toBe('Occipital Lobe');
        expect(responses.isCorrect(1)).toBe(false);
    });
});