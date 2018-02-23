var includes = require('../common/includes.js'),
    data = includes.data,
    common = new includes.Common(browser),
    viewSetsPage = new includes.ViewSetsPage(browser),
    setPage = new includes.SetPage(browser),
    editQcPage = new includes.EditQcPage(browser);

describe('Joining a public set', function() {
    var publicSet;

    it('should show the set in the public set panel', function() {
        var publicSets;

        viewSetsPage.togglePublicSets();
        publicSets = viewSetsPage.getPublicSets();
        publicSet = publicSets.get(0);
        expect(publicSets.count()).toBe(1);
    });

    it('should show the public set name', function() {
        expect(publicSet.getText()).toContain(data.sets.public.name.toUpperCase());
    });

    it('should show a join button initially', function() {
        var joinBtn = viewSetsPage.getPublicJoinBtn(publicSet);

        expect(joinBtn.isPresent()).toBe(true);
        joinBtn.click();
    });

    it('should show a button to view the collection after joining', function() {
        var viewBtn = viewSetsPage.getPublicViewBtn(publicSet);
        expect(viewBtn.isDisplayed()).toBe(true);
        viewBtn.click();
        browser.sleep(1000);
    });
});

describe('Viewing a public/read-only collection', function() {
    it('should show a notice that the user has read-only permissions', function() {
        setPage.initSubsets().then(function() {
            expect(setPage.isReadOnly()).toBe(true);
        });
    });

    it('should not show a list of users', function() {
        expect(setPage.getUsersAccordion().isPresent()).toBe(false);
    });

    it('should show features that are enabled but not allow the user to toggle them', function() {
        setPage.openFeaturesAccordion();
        setPage.featurePanel.getFeatures().each(function(feature) {
            expect(setPage.featurePanel.isFeatureToggleable(feature)).toBe(false);
        });
    });

    it('should not allow the user to add, edit, or delete subsets', function() {
        //just one subset in here
        var subset = setPage.getSubset(0);

        expect(setPage.getAddSubsetBtn().isPresent()).toBe(false);
        expect(subset.getEditSubsetBtn().isPresent()).toBe(false);
        expect(subset.getDeleteSubsetBtn().isPresent()).toBe(false);
    });

    it('should not allow the user to add or delete quick checks', function() {
        var subset = setPage.getSubset(0),
            quickcheck = subset.getQuickChecks().get(0);

        expect(subset.getAddQcBtn().isPresent()).toBe(false);
        expect(subset.getDeleteQcBtn(quickcheck).isPresent()).toBe(false);
        subset.editQuickCheck(quickcheck);
    });
});

//I was worried about having to check every single question type to make sure that a read-only user can't make edits,
//but let's take a more macro look at this and loop through every type of input and make sure that it is disabled
describe('Viewing a read-only quick check', function() {
    it('should show a read-only notice', function() {
        editQcPage.initQuestions();
        expect(editQcPage.isReadOnly()).toBe(true);
    });

    it('should disable all input fields', function() {
        expect(editQcPage.areInputsDisabled()).toBe(true);
    });

    it('should hide delete question and delete option buttons', function() {
        editQcPage.questions.forEach(function(question) {
            expect(question.getDeleteBtn().isPresent()).toBe(false);
            expect(question.getDeleteOptionBtns().count()).toBe(0);
        });
    });

    it('should hide the save button', function() {
        expect(editQcPage.getSaveBtn().isPresent()).toBe(false);
        editQcPage.nav.goToSets();
    });
});

describe('Opting out of a public set', function() {
    var publicSet;

    it('should show an opt-out button after joining', function() {
        var optOutBtn;

        viewSetsPage.togglePublicSets();
        publicSet = viewSetsPage.getPublicSets().get(0);
        optOutBtn = viewSetsPage.getPublicOptOutBtn(publicSet);
        expect(optOutBtn.isPresent()).toBe(true);
        optOutBtn.click();
    });

    it('should show a join button after opting out', function() {
        expect(viewSetsPage.getPublicJoinBtn(publicSet).isPresent()).toBe(true);
    });
});