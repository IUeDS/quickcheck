var includes = require('../common/includes.js'),
    data = includes.data,
    canvasAssignmentsPage = new includes.CanvasAssignmentsPage(browser),
    canvasModulesPage = new includes.CanvasModulesPage(browser),
    common = new includes.Common(browser),
    embedPage = new includes.EmbedPage(browser),
    qcPage = new includes.QcPage(browser);

describe('Embedding assessments', function() {
    it('should show all collections in the modal window', function() {
        var qcName = data.sets.featuresAllOn.quickchecks.featuresAllOn,
            setNames = [ data.sets.featuresAllOn.name, data.sets.featuresAllOff.name ];

        common.switchToCanvas().then(function() {
            //set due date to last day of year (if we just specify a string date that's month-specific, Canvas will assume this year)
            canvasAssignmentsPage.createAssignmentAndOpenEmbed(qcName, '7', 'Dec 30').then(function() {
                common.enterAngularPage();
                setNames.forEach(function(setName, index) {
                    expect(embedPage.getSets().get(index).getText()).toContain(setName);
                });
            });
        });
    });

    it('should show all assessment groups in the modal window', function() {
        var subsetNames = [
            data.sets.featuresAllOn.subsets.group1,
            data.sets.featuresAllOn.subsets.group2,
            data.sets.featuresAllOff.subsets.group1
        ],
            subsets = embedPage.getSubsets();

        subsetNames.forEach(function(subsetName, index) {
            expect(subsets.get(index).getText()).toContain(subsetName);
        });
    });

    it('should show all assessments in the modal window', function() {
        var qcGroup1 = data.sets.featuresAllOn.quickchecks,
            qcGroup2 = data.sets.featuresAllOff.quickchecks,
            qcNames = [
                qcGroup1.featuresAllOn,
                qcGroup1.qtiImportGraded,
                qcGroup1.qtiImportUngraded,
                qcGroup2.urlEmbed,
                qcGroup2.featuresAllOffPastDue,
                qcGroup2.resultsNotReleased
            ],
            quickchecks = embedPage.getQuickChecks();

        qcNames.forEach(function(qcName, index) {
            expect(quickchecks.get(index).getText()).toContain(qcName);
        });
    });

    it('should show search results when text is typed into the searchbar', function() {
        var quizName = data.sets.featuresAllOn.quickchecks.featuresAllOn;

        embedPage.search(quizName);
        expect(embedPage.getSearchResults().count()).toBe(1);
        expect(embedPage.getSearchResults().get(0).isDisplayed()).toBe(true);
        expect(embedPage.getSearchResults().get(0).getText()).toContain(quizName);
    });

    it('should reset the search bar and results when clear search is clicked', function() {
        embedPage.clearSearch();
        expect(embedPage.getSearchResults().count()).toBe(0);
    });

    it('should allow previewing the assessment in a new tab', function() {
        var questionText = data.quizData.quiz1.question1.questionText;

        embedPage.previewQuickCheckByIndex(0);
        common.switchTab(1);
        browser.sleep(1000);
        expect(qcPage.getQuestionText()).toBe(questionText);

        //return to QC
        browser.close();
        common.switchTab(0);
        common.switchToLtiToolEmbed().then(function() {
            common.enterAngularPage();
        });
    });

    //the default view and search results view use separate markup, so make sure we are
    //testing both; previously had a bug where embedding from search results was broken
    it('should correctly embed the assessment when retrieved as a search result', function() {
        var quizName = data.sets.featuresAllOn.quickchecks.featuresAllOn;

        embedPage.search(quizName);
        embedPage.selectSearchedQuickCheckByIndex(0);
        common.switchToCanvas().then(function() {
            canvasAssignmentsPage.saveEmbed();
        });
    });

    it('should allow for embedding a quiz as an external tool URL', function() {
        var qcName = data.sets.featuresAllOff.quickchecks.urlEmbed;

        canvasAssignmentsPage.goToModules();
        canvasModulesPage.addModule('Test');
        canvasModulesPage.addExternalToolLink();
        return common.switchToLtiToolEmbed().then(function() {
            common.enterAngularPage();
            embedPage.search(qcName);
            embedPage.selectSearchedQuickCheckByIndex(0);
            common.switchToCanvas().then(function() {
                canvasModulesPage.setExternalToolTitle(qcName);
                canvasModulesPage.saveExternalTool();
                canvasModulesPage.publishModuleItem();
                //click on the link, so we can log an instructor attempt, allowing us to view, then release results
                browser.element(by.partialLinkText(qcName)).click();
            });
        });

    });

    //next, embed 2 more quizzes, just single questions, to test other functionality
    //(4 total quizzes for student to take--one with automatic grade passback, a second as an external url link,
    //a third to test manual grading, and a fourth to test auto-grade functionality)
    it('should embed the third quiz', function() {
        var qcName = data.sets.featuresAllOff.quickchecks.featuresAllOffPastDue;
        canvasAssignmentsPage.createAssignmentAndOpenEmbed(qcName, '1', 'Jan 1').then(function() {
            common.enterAngularPage();
            embedPage.search(qcName);
            embedPage.selectSearchedQuickCheckByIndex(0);
            common.switchToCanvas().then(function() {
                canvasAssignmentsPage.saveEmbed();
            });
        });
    });

    it('should embed the fourth quiz', function() {
        var qcName = data.sets.featuresAllOff.quickchecks.resultsNotReleased;
        canvasAssignmentsPage.createAssignmentAndOpenEmbed(qcName, '1').then(function() {
            common.enterAngularPage();
            embedPage.search(qcName);
            embedPage.selectSearchedQuickCheckByIndex(0);
            common.switchToCanvas().then(function() {
                canvasAssignmentsPage.saveEmbed();
            });
        });

    });

    //needed to add a second automatic grade passback quiz since there was a bug with this functionality; using the QTI import quiz
    //since it was already available
    it('should embed the QTI import quiz', function() {
        var qcName = data.sets.featuresAllOn.quickchecks.qtiImportGraded;
        canvasAssignmentsPage.createAssignmentAndOpenEmbed(qcName, '1').then(function() {
            common.enterAngularPage();
            embedPage.search(qcName);
            embedPage.selectSearchedQuickCheckByIndex(0);
            common.switchToCanvas().then(function() {
                canvasAssignmentsPage.saveEmbed();
            });
        });
    });
});