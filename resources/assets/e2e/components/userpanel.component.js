var UserPanelComponent = function(browserRef) {
    var component = this;
    component.browser = browserRef;

    //element references
    component.addAnotherUserBtn = component.browser.element(by.partialButtonText('Add another user'));
    component.addUserBtn = component.browser.element(by.partialButtonText('Add a user to this set'));
    component.cancelBtn = component.browser.element(by.buttonText('Cancel'));
    component.editMembershipBtn = component.browser.element(by.css('.qc-users-edit-btn'));
    component.editMembershipList = component.browser.element.all(by.css('.qc-users-edit-user'));
    component.newUsernameInput = component.browser.element(by.id('username'));
    component.saveEditsBtn = component.browser.element(by.partialButtonText('Save User Edits'));
    component.submitUserBtn = component.browser.element(by.buttonText('Validate and add user'));
    component.successMessage = component.browser.element(by.css('.alert-success'));
    component.userList = component.browser.element(by.css('#qc-user-list'));
    component.usersList = component.browser.element.all(by.css('.qc-users-user'));
    component.validationError = component.userList.element(by.css('.alert-danger'));

    //string references (for ad-hoc sub-elements)
    component.deleteBtn = '.qc-delete-user-btn';
    component.deletedClass = 'danger';
    component.readOnly = '.qc-read-only-input';

    //functions
    component.addAnotherUser = addAnotherUser;
    component.addUser = addUser;
    component.cancelAddUser = cancelAddUser;
    component.deleteUser = deleteUser;
    component.editMembership = editMembership;
    component.getEditMembershipList = getEditMembershipList;
    component.getNewUsernameInput = getNewUsernameInput;
    component.getUsersList = getUsersList;
    component.getUserValidationError = getUserValidationError;
    component.getUserSaveSuccess = getUserSaveSuccess;
    component.isReadOnlyBoxChecked = isReadOnlyBoxChecked;
    component.isUserStagedForDeletion = isUserStagedForDeletion;
    component.saveUserEdits = saveUserEdits;
    component.submitNewUser = submitNewUser;
    component.toggleReadOnlyBox = toggleReadOnlyBox;

    async function addAnotherUser() {
        await component.addAnotherUserBtn.click();
    }

    async function addUser() {
        await component.addUserBtn.click();
    }

    async function cancelAddUser() {
        await component.cancelBtn.click();
    }

    async function deleteUser(membershipItem) {
        await membershipItem.element(by.css(component.deleteBtn)).click()
    }

    async function editMembership() {
        await component.editMembershipBtn.click();
    }

    function getEditMembershipList() {
        return component.editMembershipList;
    }

    function getNewUsernameInput() {
        return component.newUsernameInput;
    }

    function getUsersList() {
        return component.usersList;
    }

    function getUserValidationError() {
        return component.validationError;
    }

    function getUserSaveSuccess() {
        return component.successMessage;
    }

    async function isReadOnlyBoxChecked(membershipItem) {
        return await membershipItem.element(by.css(component.readOnly)).getAttribute('checked');
    }

    async function isUserStagedForDeletion(membershipItem) {
        const classString = await membershipItem.getAttribute('class');

        if (classString.indexOf(component.deletedClass) < 0) {
            return false;
        }

        return true;
    }

    async function saveUserEdits() {
        await component.saveEditsBtn.click();
    }

    async function submitNewUser() {
        await component.submitUserBtn.click();
    }

    async function toggleReadOnlyBox(membershipItem) {
        await membershipItem.element(by.css(component.readOnly)).click();
    }
};

module.exports = UserPanelComponent;