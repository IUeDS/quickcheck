var includes = require('../common/includes.js'),
    data = includes.data,
    common = new includes.Common(browser),
    attemptOverviewPage = new includes.AttemptOverviewPage(browser),
    attemptsPage = new includes.AttemptsPage(browser),
    viewSetspage = new includes.ViewSetsPage(browser),
    setPage = new includes.SetPage(browser),
    editQcPage = new includes.EditQcPage(browser);

describe('Viewing assessments that are custom activities', function() {
    it('should show the proper custom activity information', function() {
        var set,
            subset,
            quickcheck;

        //custom activity is first set, first subset, first quick check
        set = viewSetspage.getMembershipTiles().first();
        viewSetspage.getGoToSetBtn(set).click();
        browser.sleep(1000);
        setPage.initSubsets().then(function() {
            subset = setPage.getSubset(0);
            quickcheck = subset.getQuickChecks().get(0);
            subset.editQuickCheck(quickcheck);
            expect(editQcPage.getCustomName()).toContain(data.customActivity.name);
        });
    });

    it('should not allow an instructor to change a custom activity', function() {
        expect(editQcPage.getCustomDropdown().isPresent()).toBe(false);
    });

    it('should not allow an instructor to delete a custom activity', function() {
        expect(editQcPage.getCustomDeleteBtn().isPresent()).toBe(false);
    });

    it('should allow the instructor to change parts of the assessment unrelated to the custom activity', function() {
        var nameInput = editQcPage.getNameInput();
        nameInput.clear();
        nameInput.sendKeys('Name does not matter');
        editQcPage.save();
        expect(editQcPage.getSaveSuccess().isDisplayed()).toBe(true);
        editQcPage.goBackToSet();
        setPage.nav.goToSets();
    });
});