var includes = require('../common/includes.js'),
    allQuestionTypesData = new includes.AllQuestionTypesData(),
    common = new includes.Common(browser),
    data = includes.data,
    editQcPage = new includes.EditQcPage(browser),
    setPage = new includes.SetPage(browser),
    viewSetsPage = new includes.ViewSetsPage(browser);

describe('Copying a quick check', function() {
    var set,
        subset,
        quickCheck,
        setData = data.sets.featuresAllOn;

    it('should display the correct form when the copy button is clicked', function() {
        //navigate to set.
        //open in new tab so we can delete the copied QC without protractor
        //freaking out over a confirm that appears in an iframe
        setPage.nav.goToSets();
        set = viewSetsPage.getMembershipTiles().first();
        viewSetsPage.getGoToSetNewTabBtn(set).click();
        common.switchTab(1);

        setPage.initSubsets().then(function() {
            subset = setPage.getSubset(1);
            quickCheck = subset.getQuickChecks().get(0);
            subset.copyQuickCheck(quickCheck);
            expect(subset.getCopyPanel(quickCheck).isDisplayed()).toBe(true);
        });
    });

    it('should default to the current set', function() {
        expect(subset.getCopySelectSetDropdownValue(quickCheck)).toContain(setData.name);
    });

    it('should default to the current subset', function() {
        expect(subset.getCopySelectSubsetDropdownValue(quickCheck)).toContain(setData.subsets.group2);
    });

    it('should default to the name of the quick check plus copy', function() {
        var name = setData.quickchecks.featuresAllOn + ' copy';
        expect(subset.getCopyQuickCheckName(quickCheck)).toBe(name);
    });

    it('should list all set memberships as possibilities', function() {
        var options = subset.getCopySelectSetDropdownOptions(quickCheck);
        expect(options.count()).toBe(2);
        expect(options.get(0).getText()).toContain(setData.name);
        expect(options.get(1).getText()).toContain(data.sets.featuresAllOff.name);
    });

    it('should list all subsets in the default set', function() {
        var options = subset.getCopySelectSubsetDropdownOptions(quickCheck);
        expect(options.count()).toBe(2);
        expect(options.get(0).getText()).toContain(setData.subsets.group1);
        expect(options.get(1).getText()).toContain(setData.subsets.group2);
    });

    it('should show the copied quick check in the subset after saving', function() {
        subset.submitCopy(quickCheck);
        expect(subset.getQuickChecks().count()).toBe(2);
    });

    it('should contain a link to edit the newly copied quick check', function() {
        var editBtn = subset.getCopyEditBtn(quickCheck);
        expect(editBtn.isDisplayed()).toBe(true);

        //next, click the button to edit
        editBtn.click();
        browser.sleep(1000);
    });
});

describe('Copying a quick check should keep the data intact', function() {
    allQuestionTypesData.verify(editQcPage, data);

    it('and delete successfully afterward', function() {
        //delete the copied quick check and go back to iframe in original tab
        editQcPage.save();
        editQcPage.goBackToSet();
        setPage.initSubsets().then(function() {
            subset = setPage.getSubset(1);
            quickCheck = subset.getQuickChecks().get(1);
            subset.deleteQuickCheck(quickCheck);
            common.acceptAlert(browser);
            common.closeTab();
            common.switchTab(0);
            common.enterNonAngularPage();
            common.switchToLtiTool();
            common.enterAngularPage();
            set = viewSetsPage.getMembershipTiles().first();
            viewSetsPage.getGoToSetBtn(set).click();
            browser.sleep(1000);
        });
    });
});