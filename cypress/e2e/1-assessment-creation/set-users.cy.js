import { setPage } from '../../support/pages/setPage';
import data from '../../support/data/data';
import { userPanel } from '../../support/components/userpanel.component';

describe('Adding a user to a collection', function () {
    const inviteUser = data.instructorInviteUsername;
    let usersList,
        usernameInput;

    before(() => {
        cy.newLocalSet();
    });

    beforeEach(() => {
        const url = data.urls.local.setPage;
        cy.visit(url);
        setPage.toggleUsersAccordion();
    });

    it('should only show the logged-in user as belonging to the collection', function () {
        usersList = userPanel.getUsersList();
        usersList.eq(0).invoke('text').should('contain', data.instructorLocalUsername);
    });

    it('should show the add user form when the button is clicked', function () {
        userPanel.addUser();
        usernameInput = userPanel.getNewUsernameInput();
        usernameInput.should('be.visible');
    });

    it('should reject a user if their username is not a valid IU CAS username', function () {
        userPanel.addUser();
        usernameInput = userPanel.getNewUsernameInput();
        usernameInput.type('thisisasuperfakeusername');
        userPanel.submitNewUser();
        userPanel.getUserValidationError().should('be.visible');
    });

    it('should validate a user if their username is a valid IU CAS username', function () {
        userPanel.addUser();
        usernameInput = userPanel.getNewUsernameInput();
        usernameInput.type(inviteUser);
        userPanel.submitNewUser();
        userPanel.getUserSaveSuccess().should('be.visible');
        userPanel.getUsersList().eq(1).invoke('text').should('contain', inviteUser);
    });

    it('should hide the add user form when closed', function () {
        userPanel.addUser();
        userPanel.cancelAddUser();
        usernameInput.should('not.exist');
    });
});

describe('Editing users in a collection', function () {
    const inviteUser = data.instructorInviteUsername;

    before(() => {
        cy.newLocalSet();
        //manually add the test user; not worth a seed command for just one small test
        const url = data.urls.local.setPage;
        cy.visit(url);
        setPage.toggleUsersAccordion();
        userPanel.addUser();
        const usernameInput = userPanel.getNewUsernameInput();
        usernameInput.type(inviteUser);
        userPanel.submitNewUser();
        cy.wait(1000); //wait for save
    });

    beforeEach(() => {
        const url = data.urls.local.setPage;
        cy.visit(url);
        setPage.toggleUsersAccordion();
        cy.wait(1000).then(() => { //wait for users to load
            userPanel.editMembership();
        });
    });

    it('should show the logged-in user and the invited user', function() {
        const membershipList = userPanel.getEditMembershipList();
        membershipList.should('have.length', 2);
    });

    it('should edit read-only status properly', function () {
        userPanel.isReadOnlyBoxChecked(userPanel.getEditMembershipList().eq(1)).should('be.false');
        userPanel.toggleReadOnlyBox(userPanel.getEditMembershipList().eq(1));
        userPanel.saveUserEdits();
        userPanel.getUsersList().eq(1).invoke('text').should('contain', 'Read-only');
        userPanel.editMembership();
        userPanel.isReadOnlyBoxChecked(userPanel.getEditMembershipList().eq(1)).should('be.true');
    });

    it('should delete a user properly', function() {
        userPanel.deleteUser(userPanel.getEditMembershipList().eq(1));
        userPanel.isUserStagedForDeletion(userPanel.getEditMembershipList().eq(1));
        userPanel.saveUserEdits();
        userPanel.getUserSaveSuccess().should('be.visible');
        userPanel.getUsersList().should('have.length', 1);
        userPanel.getUsersList().eq(0).invoke('text').should('contain', data.instructorLocalUsername);
    });
});