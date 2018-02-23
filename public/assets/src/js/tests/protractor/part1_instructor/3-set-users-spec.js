var includes = require('../common/includes.js'),
    creds = includes.userCreds,
    setPage = new includes.SetPage(browser);

describe('Adding a user to a collection', function () {
    var usersList,
        usernameInput;

    it('should show the users panel when clicked', function () {
        setPage.toggleUsersAccordion();
        usersList = setPage.userPanel.getUsersList();
        expect(usersList.count()).toBe(1);
    });

    it('should only show the logged-in user as belonging to the collection', function () {
        //8/22/16: Canvas seems to change its mind every week or two whether it's going to record guest accounts as
        //their email addresses or as their ID number for the canvas login. There is not a way to test OR conditions
        //in jasmine, so instead, manually check that it matches username OR id, and expect that to be true.
        usersList.get(0).getText().then(function(username) {
            var correctUser = false;
            if (username === creds.instructor.id || username === creds.instructor.username) {
                correctUser = true;
            }
            expect(correctUser).toBe(true);
        });
    });

    it('should show the add user form when the button is clicked', function () {
        setPage.userPanel.addUser();
        usernameInput = setPage.userPanel.getNewUsernameInput();
        expect(usernameInput.isDisplayed()).toBe(true);
    });

    it('should reject a user if their username is not a valid IU CAS username', function () {
        usernameInput.sendKeys('thisisasuperfakeusername');
        setPage.userPanel.submitNewUser();
        expect(setPage.userPanel.getUserValidationError().isDisplayed()).toBe(true);
    });

    it('should validate a user if their username is a valid IU CAS username', function () {
        usernameInput.clear();
        usernameInput.sendKeys(browser.params.inviteUser);
        setPage.userPanel.submitNewUser();
        expect(setPage.userPanel.getUserSaveSuccess().isDisplayed()).toBe(true);
    });

    it('should hide the add user form after successful validation', function() {
        expect(usernameInput.isPresent()).toBe(false);
    });

    it('should allow adding another user after the first was added', function () {
        setPage.userPanel.addAnotherUser();
        expect(usernameInput.isDisplayed()).toBe(true);
    });

    it('should hide the add user form when closed', function () {
        setPage.userPanel.cancelAddUser();
        expect(usernameInput.isPresent()).toBe(false);
    });

    it('should add the user to the list of users in the collection', function () {
        expect(setPage.userPanel.getUsersList().get(1).getText()).toContain(browser.params.inviteUser);
    });
});


describe('Editing users in a collection', function () {
    var membershipList = setPage.userPanel.getEditMembershipList(),
        editedUser = membershipList.get(1); //logged-in user is in list, but hidden; new user 2nd

    it('should show users other than the logged-in user', function () {
        setPage.userPanel.editMembership();
        expect(editedUser.getText()).toContain(browser.params.inviteUser);
    });

    it('should not show the logged-in user', function() {
        expect(membershipList.get(0).isDisplayed()).toBe(false);
    });

    it('should not have the read-only box checked if the user is not read-only', function () {
        expect(setPage.userPanel.isReadOnlyBoxChecked(editedUser)).toBeFalsy();
    });

    it('should update a user as read-only in the display list after checking read-only box', function () {
        setPage.userPanel.toggleReadOnlyBox(editedUser);
        setPage.userPanel.saveUserEdits();
        expect(setPage.userPanel.getUsersList().get(1).getText()).toContain('Read-only');
    });

    it('should have the read-only box checked if the user is read-only', function () {
        setPage.userPanel.editMembership();
        expect(setPage.userPanel.isReadOnlyBoxChecked(editedUser)).toBeTruthy();
    });

    it('should highlight the row if the delete button is clicked before saving', function() {
        setPage.userPanel.deleteUser(editedUser);
        expect(setPage.userPanel.isUserStagedForDeletion(editedUser)).toBe(true);
    });

    it('should show a success message after deletion', function() {
        setPage.userPanel.saveUserEdits();
        expect(setPage.userPanel.getUserSaveSuccess().isDisplayed()).toBe(true);
    });

    it('should delete a user from the list if deleted', function () {
        expect(setPage.userPanel.getUsersList().count()).toBe(1);
        //don't check specifically for the logged-in username, since Canvas changes its mind so often
        //about whether to display ID number or email address; could result in false negative
        expect(setPage.userPanel.getUsersList().get(0).getText()).not.toBe(browser.params.inviteUser);
        setPage.toggleUsersAccordion();
    });
});