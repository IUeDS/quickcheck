var includes = require('../common/includes.js'),
    common = new includes.Common(browser),
    data = includes.data,
    setPage = new includes.SetPage(browser),
    sets = data.sets,
    viewSetsPage = new includes.ViewSetsPage(browser),
    EC = protractor.ExpectedConditions;

describe('Adding a set', function () {
    it('should show the necessary form when the add set button is clicked', async function () {
        await viewSetsPage.clickAddSetBtn();
        expect(await viewSetsPage.getAddSetNameField().isDisplayed()).toBeTruthy();
    });

    it('should add the set to the user\’s list after being created', async function () {
        await viewSetsPage.getAddSetNameField().sendKeys(sets.toBeDeleted.name);
        await viewSetsPage.getAddDescriptionNameField().sendKeys(sets.toBeDeleted.description);
        //browser.sleep(1000); //ugh, kept on failing here for NO REASON on some runs, worked fine on others
        await viewSetsPage.saveNewSet();
        let membershipTiles = viewSetsPage.getMembershipTiles();
        const newSet = membershipTiles.get(0);
        //await browser.wait(EC.visibilityOf(newSet, 10000));
        //sometimes this button just does not want to get clicked, it makes no sense
        if (!await newSet.isPresent()) {
            await viewSetsPage.saveNewSet();
            membershipTiles = viewSetsPage.getMembershipTiles();
        }

        expect(await membershipTiles.count()).toBe(1);
    });

    it('should hide the add new set form after it was created', async function() {
        expect(await viewSetsPage.getAddSetNameField().isPresent()).toBe(false);
    });

    it('should hide instructions for how to add a set after one was created', async function() {
        expect(await viewSetsPage.getInitialInstructions().isPresent()).toBe(false);
    });
});

describe('Editing a set', function () {
    var descriptionInput,
        nameInput,
        setElement;

    it('should show the necessary form when the button is clicked', async function () {
        setElement = viewSetsPage.getMembershipTiles().first();
        await viewSetsPage.editSet(setElement);
        nameInput = viewSetsPage.getEditedNameInput(setElement);
        descriptionInput = viewSetsPage.getEditedDescriptionInput(setElement);
        expect(await nameInput.isPresent()).toBe(true);
    });

    it('should have the correct set name in the editing form', async function() {
        expect(await nameInput.getAttribute('value')).toEqual(sets.toBeDeleted.name);
    });

    it('should have the correct set description in the editing form', async function() {
        expect(await descriptionInput.getAttribute('value')).toEqual(sets.toBeDeleted.description);
    });

    it('should change the set name in the user\'s list after being saved', async function () {
        await nameInput.clear();
        sets.toBeDeleted.name = 'Edited name';
        await nameInput.sendKeys(sets.toBeDeleted.name);
        await descriptionInput.clear();
        sets.toBeDeleted.description = 'Edited description';
        await descriptionInput.sendKeys(sets.toBeDeleted.description);
        await viewSetsPage.updateSet(setElement);
        expect(await viewSetsPage.getSetName(setElement)).toBe(sets.toBeDeleted.name.toUpperCase());
    });

    it('should hide the editing form after saving', async function() {
        expect(await nameInput.isPresent()).toBe(false);
    });

    it('should change the set description in the user\'s list after being saved', async function() {
        //note: description is not shown on the tile, so have to open up editing interface to check
        await viewSetsPage.editSet(setElement);
        expect(await descriptionInput.getAttribute('value')).toEqual(sets.toBeDeleted.description);
    });

    it('should hide the form when canceling an edit', async function() {
        await viewSetsPage.cancelSetEdit(setElement);
        expect(await nameInput.isPresent()).toBe(false);
    });
});

//NOTE: protractor was throwing an error and shutting down each time an alert message came up; surprisingly, couldn't find
//any similar errors from other developers when googling, so not sure how to solve it. I think it's getting confused because
//the app is in an iframe and the context for the alert message is appearing in the parent window. To get around this, we'll
//open the collection in a new tab, so the alert does not throw an error in protractor. We also need to test the alert that
//appears when a user tries to navigate away from editing a quiz after entering data. So we'll test all of that in a new tab,
//then test deleting the assessment/group/collection, then close the tab and navigate back to the previous tab to go back to
//the Canvas iframe.

describe('Viewing a set', function () {
    it('should initially show instructions for adding a subset', async function () {
        var membershipTile = viewSetsPage.getMembershipTiles().first(),
            newTabBtn = viewSetsPage.getGoToSetNewTabBtn(membershipTile);

        await newTabBtn.click();
        await common.switchTab(1);
        expect(await setPage.getInitialInstructions().isDisplayed()).toBe(true);
    });
});