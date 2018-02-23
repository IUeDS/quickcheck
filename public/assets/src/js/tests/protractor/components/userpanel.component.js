var UserPanelComponent = function(browserRef) {
    var component = this;
    component.browser = browserRef;

    //element references
    component.addAnotherUserBtn = component.browser.element(by.partialButtonText('Add another user'));
    component.addUserBtn = component.browser.element(by.partialButtonText('Add a user to this set'));
    component.cancelBtn = component.browser.element(by.buttonText('Cancel'));
    component.editMembershipBtn = component.browser.element(by.css('.qc-users-edit-btn'));
    component.editMembershipList = component.browser.element.all(by.repeater('user in vm.isEditingUsers.users'));
    component.newUsernameInput = component.browser.element(by.id('username'));
    component.saveEditsBtn = component.browser.element(by.partialButtonText('Save User Edits'));
    component.submitUserBtn = component.browser.element(by.buttonText('Validate and add user'));
    component.successMessage = component.browser.element(by.css('.alert-success'));
    component.userList = component.browser.element(by.css('#qc-user-list'));
    component.usersList = component.browser.element.all(by.repeater('user in vm.collectionUsers'));
    component.validationError = component.userList.element(by.css('.alert-danger'));

    //string references (for ad-hoc sub-elements)
    component.deleteBtn = '.qc-delete-user-btn';
    component.deletedClass = 'danger';
    component.readOnlyModel = 'user.readOnly';

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

    function addAnotherUser() {
        component.addAnotherUserBtn.click();
    }

    function addUser() {
        component.addUserBtn.click();
    }

    function cancelAddUser() {
        component.cancelBtn.click();
    }

    function deleteUser(membershipItem) {
        membershipItem.element(by.css(component.deleteBtn)).click()
    }

    function editMembership() {
        component.editMembershipBtn.click();
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

    function isReadOnlyBoxChecked(membershipItem) {
        return membershipItem.element(by.model(component.readOnlyModel)).getAttribute('checked');
    }

    function isUserStagedForDeletion(membershipItem) {
        return membershipItem.getAttribute('class').then(function(classString) {
            if (classString.indexOf(component.deletedClass) < 0) {
                return false;
            }
            return true;
        });
    }

    function saveUserEdits() {
        component.saveEditsBtn.click();
    }

    function submitNewUser() {
        component.submitUserBtn.click();
    }

    function toggleReadOnlyBox(membershipItem) {
        membershipItem.element(by.model(component.readOnlyModel)).click();
    }
};

module.exports = UserPanelComponent;