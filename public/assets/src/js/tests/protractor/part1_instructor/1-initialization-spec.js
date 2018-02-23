var includes = require('../common/includes.js'),
    canvasLoginPage = new includes.CanvasLoginPage(browser),
    common = new includes.Common(browser),
    creds = includes.userCreds,
    data = includes.data,
    homePage = new includes.HomePage(browser),
    navComponent = new includes.NavComponent(browser),
    viewSetsPage = new includes.ViewSetsPage(browser);

describe('Navigating to the tool in Canvas', function () {
    it('should show the tool name in the Canvas nav', function () {
        common.enterNonAngularPage();
        canvasLoginPage.login(creds.instructor.username, creds.instructor.password);
        expect(canvasLoginPage.getNavItems()).toContain(common.toolName);
    });

    it('should reach the assessment home page when the tool is clicked', function () {
        common.goToQuickCheck().then(function() {
            common.enterAngularPage();
            expect(homePage.getHeader()).toContain('QUICK CHECK');
            navComponent.goToSets();
        });
    });
});

describe('Accessing the list of sets for the first time', function() {
    it('should show no sets, but instead a message with instructions', function() {
        expect(viewSetsPage.getMembershipTiles().count()).toBe(0);
        expect(viewSetsPage.getInitialInstructions().isPresent()).toBe(true);
    });

    it('should not show a search box for sets', function() {
        expect(viewSetsPage.getSearchBox().isPresent()).toBe(false);
    });
});
