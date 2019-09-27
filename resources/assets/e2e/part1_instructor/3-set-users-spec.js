var includes = require('../common/includes.js'),
    creds = includes.userCreds,
    setPage = new includes.SetPage(browser);

describe('Adding a user to a collection', function () {
    var usersList,
        usernameInput;

    it('should show the users panel when clicked', async function () {
        await setPage.toggleUsersAccordion();
        usersList = setPage.userPanel.getUsersList();
        expect(await usersList.count()).toBe(1);
    });

    it('should only show the logged-in user as belonging to the collection', async function () {
        //8/22/16: Canvas seems to change its mind every week or two whether it's going to record guest accounts as
        //their email addresses or as their ID number for the canvas login. There is not a way to test OR conditions
        //in jasmine, so instead, manually check that it matches username OR id, and expect that to be true.
        const username = await usersList.get(0).getText();
        let correctUser = false;

        if (username === creds.instructor.id || username === creds.instructor.username) {
            correctUser = true;
        }

        expect(correctUser).toBe(true);
    });

    it('should show the add user form when the button is clicked', async function () {
        await setPage.userPanel.addUser();
        usernameInput = setPage.userPanel.getNewUsernameInput();
        expect(await usernameInput.isDisplayed()).toBe(true);
    });

    it('should reject a user if their username is not a valid IU CAS username', async function () {
        await usernameInput.sendKeys('thisisasuperfakeusername');
        await setPage.userPanel.submitNewUser();
        expect(await setPage.userPanel.getUserValidationError().isDisplayed()).toBe(true);
    });

    it('should validate a user if their username is a valid IU CAS username', async function () {
        await usernameInput.clear();
        await usernameInput.sendKeys(browser.params.inviteUser);
        await setPage.userPanel.submitNewUser();
        expect(await setPage.userPanel.getUserSaveSuccess().isDisplayed()).toBe(true);
    });

    it('should hide the add user form after successful validation', async function() {
        expect(await usernameInput.isPresent()).toBe(false);
    });

    it('should allow adding another user after the first was added', async function () {
        await setPage.userPanel.addAnotherUser();
        expect(await usernameInput.isDisplayed()).toBe(true);
    });

    it('should hide the add user form when closed', async function () {
        await setPage.userPanel.cancelAddUser();
        expect(await usernameInput.isPresent()).toBe(false);
    });

    it('should add the user to the list of users in the collection', async function () {
        expect(await setPage.userPanel.getUsersList().get(1).getText()).toContain(browser.params.inviteUser);
    });
});


describe('Editing users in a collection', function () {
    var membershipList = setPage.userPanel.getEditMembershipList(),
        editedUser = membershipList.get(1); //logged-in user is in list, but hidden; new user 2nd

    it('should show users other than the logged-in user', async function () {
        await setPage.userPanel.editMembership();
        expect(await editedUser.getText()).toContain(browser.params.inviteUser);
    });

    it('should not show the logged-in user', async function() {
        expect(await membershipList.get(0).isDisplayed()).toBe(false);
    });

    it('should not have the read-only box checked if the user is not read-only', async function () {
        expect(await setPage.userPanel.isReadOnlyBoxChecked(editedUser)).toBeFalsy();
    });

    it('should update a user as read-only in the display list after checking read-only box', async function () {
        await setPage.userPanel.toggleReadOnlyBox(editedUser);
        await setPage.userPanel.saveUserEdits();
        expect(await setPage.userPanel.getUsersList().get(1).getText()).toContain('Read-only');
    });

    it('should have the read-only box checked if the user is read-only', async function () {
        await setPage.userPanel.editMembership();
        expect(await setPage.userPanel.isReadOnlyBoxChecked(editedUser)).toBeTruthy();
    });

    it('should highlight the row if the delete button is clicked before saving', async function() {
        await setPage.userPanel.deleteUser(editedUser);
        expect(await setPage.userPanel.isUserStagedForDeletion(editedUser)).toBe(true);
    });

    it('should show a success message after deletion', async function() {
        await setPage.userPanel.saveUserEdits();
        expect(await setPage.userPanel.getUserSaveSuccess().isDisplayed()).toBe(true);
    });

    it('should delete a user from the list if deleted', async function () {
        expect(await setPage.userPanel.getUsersList().count()).toBe(1);
        //don't check specifically for the logged-in username, since Canvas changes its mind so often
        //about whether to display ID number or email address; could result in false negative
        expect(await setPage.userPanel.getUsersList().get(0).getText()).not.toBe(browser.params.inviteUser);
        await setPage.toggleUsersAccordion();
    });
});