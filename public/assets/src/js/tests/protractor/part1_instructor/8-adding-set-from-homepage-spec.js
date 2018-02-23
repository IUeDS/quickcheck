var EC = protractor.ExpectedConditions,
    includes = require('../common/includes.js'),
    common = new includes.Common(browser),
    data = includes.data,
    editQcPage = new includes.EditQcPage(browser),
    homePage = new includes.HomePage(browser),
    setPage = new includes.SetPage(browser);

describe('Adding a new set, subset, and quick checkfrom the home page', function() {
    var setName = data.sets.featuresAllOn.name,
        subsetName = data.sets.featuresAllOn.subsets.group1,
        quickCheckName = data.sets.featuresAllOn.quickchecks.featuresAllOn;

    it('should show a field input when a new set is selected', function() {
        var setInput;

        //NOTE: close the new tab and go back to Canvas for this portion, now that we're done testing confirm messages/alerts
        common.closeTab();
        common.switchTab(0);
        common.enterNonAngularPage();
        common.refresh();
        common.switchToLtiTool();
        common.enterAngularPage();
        homePage.addQuickCheck();
        homePage.selectNewSet();
        setInput = homePage.getNewSetInput();
        expect(setInput.isDisplayed()).toBe(true);
        setInput.sendKeys(setName);
    });

    it('should show a field input when a new subset is selected', function() {
        var subsetInput;

        homePage.selectNewSubset();
        subsetInput = homePage.getNewSubsetInput();
        expect(subsetInput.isDisplayed()).toBe(true);
        subsetInput.sendKeys(subsetName);
    });

    it('should redirect to the new quick check after saving', function() {
        homePage.saveNewQuickCheck(quickCheckName);
        qcNameInput = editQcPage.getAssessmentName();
        expect(editQcPage.getAssessmentName()).toBe(quickCheckName);
    });

    it('should have the correct subset selected', function() {
        var subsetSelect = editQcPage.getSubsetSelect();
        expect(common.getSelectedText(subsetSelect)).toBe(subsetName);
    });

    it('should correctly save the subset', function() {
        var subset;

        editQcPage.save(); //save first to prevent alert
        editQcPage.goBackToSet();
        setPage.initSubsets();
        subset = setPage.getSubsets().get(0);
        expect(subset.getText()).toContain(subsetName);
    });

    it('should correctly save the set', function() {
        var subset,
            quickcheck;

        subset = setPage.getSubset(0);
        expect(setPage.getSetName()).toBe(setName.toUpperCase());
        //go back to the quiz
        quickcheck = subset.getQuickChecks().get(0);
        subset.editQuickCheck(quickcheck);
    });
});
