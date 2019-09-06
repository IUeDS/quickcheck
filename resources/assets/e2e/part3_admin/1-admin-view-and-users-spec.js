browser.params.browser3 = browser.forkNewDriverInstance(); //fork new browser instance for admin
var browser3 = browser.params.browser3, //define browser instance from global value
    includes = require('../common/includes.js'),
    canvasLoginPage = new includes.CanvasLoginPage(browser3),
    common = new includes.Common(browser3),
    creds = includes.userCreds,
    data = includes.data,
    homePage = new includes.HomePage(browser3),
    viewSetsPage = new includes.ViewSetsPage(browser3);

describe('An admin viewing the sets home page', function() {
    it('should see no sets initially because the admin has not personally created any', function() {
        common.enterNonAngularPage();
        canvasLoginPage.login(creds.admin.username, creds.admin.password);
        browser3.sleep(2000); //for some reason angular wasn't waiting, failed all tests, even though it works fine for instructor? argh.
        common.goToQuickCheck().then(function() {
            common.enterAngularPage();
            homePage.nav.goToSets();
            expect(viewSetsPage.getInitialInstructions().isDisplayed()).toBe(true);
        });
    });

    //this one is dependent on suite 1 and the previous sets that the instructor created
    it('should see all sets created in the system after toggling to see them', function() {
        viewSetsPage.toggleAdminViewAllSets();
        expect(viewSetsPage.getAdminSetTiles().count()).toBe(2);
        expect(viewSetsPage.getInitialInstructions().isPresent()).toBe(false);
    });


    it('should see no sets again after toggling the view for all sets back to off', function() {
        viewSetsPage.toggleAdminViewAllSets();
        expect(viewSetsPage.getAdminSetTiles().count()).toBe(0);
        expect(viewSetsPage.getInitialInstructions().isDisplayed()).toBe(true);
    });
});

describe('Inviting an admin user', function() {
    it('should show the proper form when the add admin user button is clicked', function() {
        viewSetsPage.toggleAdminViewAllSets(); //toggle back on to view all sets
        viewSetsPage.addAdminUser();
        expect(viewSetsPage.getAdminUserInput().isDisplayed()).toBe(true);
    });

    it('should throw an error when the username is invalid', function() {
        viewSetsPage.getAdminUserInput().sendKeys('Thisusernameistotallyinvalid');
        viewSetsPage.submitAdminUser();
        expect(viewSetsPage.getAdminUserValidationError().isDisplayed()).toBe(true);
    });

    it('should show a success message when the user is valid', function() {
        viewSetsPage.getAdminUserInput().clear();
        viewSetsPage.getAdminUserInput().sendKeys(browser.params.inviteUser);
        viewSetsPage.submitAdminUser();
        expect(viewSetsPage.getAdminUserSuccess().isDisplayed()).toBe(true);
    });
});