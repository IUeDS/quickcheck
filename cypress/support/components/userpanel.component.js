export class UserPanelComponent {

    constructor() {
        //element references
        this.addAnotherUserBtn = () => cy.contains('button', 'Add another user');
        this.addUserBtn = () => cy.contains('button', 'Add a user to this set');
        this.cancelBtn = () => cy.contains('button', 'Cancel');
        this.editMembershipBtn = () => cy.get('.qc-users-edit-btn');
        this.editMembershipList = () => cy.get('.qc-users-edit-user');
        this.newUsernameInput = () => cy.get('#username');
        this.saveEditsBtn = () => cy.contains('button', 'Save User Edits');
        this.submitUserBtn = () => cy.contains('button', 'Validate and add user');
        this.successMessage = () => cy.get('.alert-success');
        this.userList = () => cy.get('#qc-user-list');
        this.usersList = () => cy.get('.qc-users-user');
        this.validationError = () => this.userList().find('.alert-danger');

        //string references (for ad-hoc sub-elements)
        this.deleteBtn = '.qc-delete-user-btn';
        this.deletedClass = 'table-danger';
        this.readOnly = '.qc-read-only-input';
    }

    addAnotherUser() {
        this.addAnotherUserBtn().click();
    }

    addUser() {
        this.addUserBtn().click();
    }

    cancelAddUser() {
        this.cancelBtn().click();
    }

    deleteUser(membershipItem) {
        membershipItem.find(this.deleteBtn).click();
    }

    editMembership() {
        this.editMembershipBtn().click();
    }

    getEditMembershipList() {
        return this.editMembershipList();
    }

    getNewUsernameInput() {
        return this.newUsernameInput();
    }

    getUsersList() {
        return this.usersList();
    }

    getUserValidationError() {
        return this.validationError();
    }

    getUserSaveSuccess() {
        return this.successMessage();
    }

    isReadOnlyBoxChecked(membershipItem) {
        return membershipItem.find(this.readOnly).then($input => $input.is(':checked'));
    }

    isUserStagedForDeletion(membershipItem) {
        membershipItem.should('have.class', this.deletedClass);
    }

    saveUserEdits() {
        this.saveEditsBtn().click();
    }

    submitNewUser() {
        this.submitUserBtn().click();
    }

    toggleReadOnlyBox(membershipItem) {
        membershipItem.find(this.readOnly).click();
    }
}

export const userPanel = new UserPanelComponent();