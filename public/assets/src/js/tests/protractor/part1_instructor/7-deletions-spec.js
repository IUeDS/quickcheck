var includes = require('../common/includes.js'),
    common = new includes.Common(browser),
    setPage = new includes.SetPage(browser),
    viewSetsPage = new includes.ViewSetsPage(browser);

describe('Deleting a quick check from a subset', function () {
    it('should remove the quick check from the page', function () {
        var subset,
            quickcheck;

        setPage.initSubsets().then(function() {
            subset = setPage.getSubset(0);
            quickcheck = subset.getQuickChecks().get(0);
            subset.deleteQuickCheck(quickcheck);
            common.acceptAlert(browser);
            expect(subset.getQuickChecks().count()).toBe(0);
        });
    });
});

describe('Deleting a subset', function () {
    it('should remove the subset from the page', function () {
        var subset = setPage.getSubset(0);
        subset.deleteSubset();
        common.acceptAlert(browser);
        expect(setPage.getSubsets().count()).toBe(0);
    });
});

describe('Deleting a collection', function () {
    it('should confirm first before deleting', function () {
        var set;

        setPage.nav.goToSets();
        set = viewSetsPage.getMembershipTiles().get(0);
        viewSetsPage.deleteSet(set);
        common.acceptAlert(browser);
    });

    it('should remove the collection from the user\'s list after deletion', function () {
        //refresh because deleted sets are technically hidden rather than fetching all sets from the
        //server over again
        browser.refresh().then(function() {
            expect(viewSetsPage.getMembershipTiles().count()).toBe(0);
        });
    });
});
