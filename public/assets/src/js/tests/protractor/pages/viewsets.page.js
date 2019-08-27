var ViewSetsPage = function(browserRef) {
    var page = this;
    page.browser = browserRef;
    page.includes = require('../common/includes.js');

    //sub-components
    page.customActivities = new page.includes.CustomActivitiesComponent(page.browser);
    page.nav = new page.includes.NavComponent(page.browser);

    //elements
    page.addAdminUserBtn = page.browser.element(by.partialButtonText('Add admin user'));
    page.addSetBtn = page.browser.element(by.css('.qc-btn-add-set'));
    page.adminSetTiles = page.browser.element.all(by.repeater('collection in collectionList'));
    page.adminUserInput = page.browser.element(by.css('#username'));
    page.adminUserValidationError = page.browser.element(by.cssContainingText('p', 'User cannot be found. Please try again.'));
    page.adminUserValidationSuccess = page.browser.element(by.css('.qc-admin-add-user-success'));
    page.adminViewAllToggle = page.browser.element(by.css('.qc-admin-all-sets-toggle'));
    page.initialInstructions = page.browser.element(by.css('.qc-collection-instructions'));
    page.membershipTiles = page.browser.element.all(by.repeater('membership in membershipList'));
    page.newSetDescriptionField = page.browser.element(by.css('#collection-description'));
    page.newSetNameField = page.browser.element(by.css('#collection-name'));
    page.noPublicSetsMsg = page.browser.element(by.css('.qc-no-public-sets'));
    page.publicSets = page.browser.element.all(by.repeater('collection in vm.publicCollections'));
    page.saveNewSetBtn = page.browser.element(by.css('.qc-save-collection-btn'));
    page.searchBox = page.browser.element(by.model('vm.search.collectionName'));
    page.submitAdminUserBtn = page.browser.element(by.partialButtonText('Validate username and save'));
    page.togglePublicSetsBtn = page.browser.element(by.css('.qc-view-public-btn'));

    //selectors (for nested elements)
    page.cancelSetEditText = 'Cancel';
    page.deleteSetBtn = '.qc-collection-delete-btn';
    page.editSetBtn = '.qc-collection-edit-btn';
    page.editSetDescriptionField = 'vm.collection.editingData.description';
    page.editSetNameField = 'vm.collection.editingData.name';
    page.goToSetText = 'Go to set';
    page.newTabBtn = '.qc-view-new-tab-btn';
    page.publicJoinBtn = '.qc-join-btn';
    page.publicOptOutBtn = '.qc-opt-out-btn';
    page.publicViewBtn = '.qc-view-set-btn';
    page.saveUpdatedSetText = 'Save';
    page.setName = 'h2';

    //functions
    page.addAdminUser = addAdminUser;
    page.cancelSetEdit = cancelSetEdit;
    page.clickAddSetBtn = clickAddSetBtn;
    page.deleteSet = deleteSet;
    page.editSet = editSet;
    page.getAddDescriptionNameField = getAddDescriptionNameField;
    page.getAddSetNameField = getAddSetNameField;
    page.getAdminSetTiles = getAdminSetTiles;
    page.getAdminUserInput = getAdminUserInput;
    page.getAdminUserSuccess = getAdminUserSuccess;
    page.getAdminUserValidationError = getAdminUserValidationError;
    page.getEditedDescriptionInput = getEditedDescriptionInput;
    page.getEditedNameInput = getEditedNameInput;
    page.getGoToSetBtn = getGoToSetBtn;
    page.getGoToSetNewTabBtn = getGoToSetNewTabBtn;
    page.getInitialInstructions = getInitialInstructions;
    page.getMembershipTiles = getMembershipTiles;
    page.getNoPublicSetsMsg = getNoPublicSetsMsg;
    page.getPublicJoinBtn = getPublicJoinBtn;
    page.getPublicOptOutBtn = getPublicOptOutBtn;
    page.getPublicSets = getPublicSets;
    page.getPublicViewBtn = getPublicViewBtn
    page.getSearchBox = getSearchBox;
    page.getSetName = getSetName;
    page.isSetPublic = isSetPublic;
    page.saveNewSet = saveNewSet;
    page.submitAdminUser = submitAdminUser;
    page.toggleAdminViewAllSets = toggleAdminViewAllSets;
    page.togglePublicSets = togglePublicSets;
    page.updateSet = updateSet;

    async function addAdminUser() {
        await page.addAdminUserBtn.click();
    }

    async function cancelSetEdit(setElement) {
        await setElement.element(by.partialButtonText(page.cancelSetEditText)).click();
    }

    async function clickAddSetBtn() {
        await page.addSetBtn.click();
    }

    async function deleteSet(setElement) {
        await setElement.element(by.css(page.deleteSetBtn)).click();
    }

    async function editSet(setElement) {
        await setElement.element(by.css(page.editSetBtn)).click();
    }

    function getAddDescriptionNameField() {
        return page.newSetDescriptionField;
    }

    function getAdminSetTiles() {
        return page.adminSetTiles;
    }

    function getAdminUserInput() {
        return page.adminUserInput;
    }

    function getAdminUserSuccess() {
        return page.adminUserValidationSuccess;
    }

    function getAdminUserValidationError() {
        return page.adminUserValidationError;
    }

    function getAddSetNameField() {
        return page.newSetNameField;
    }

    function getEditedDescriptionInput(setElement) {
        return setElement.element(by.model(page.editSetDescriptionField));
    }

    function getEditedNameInput(setElement) {
        return setElement.element(by.model(page.editSetNameField));
    }

    function getGoToSetBtn(setElement) {
        return setElement.element(by.partialButtonText(page.goToSetText));
    }

    function getGoToSetNewTabBtn(setElement) {
        return setElement.element(by.css(page.newTabBtn));
    }

    function getInitialInstructions() {
        return page.initialInstructions;
    }

    function getMembershipTiles() {
        return page.membershipTiles;
    }

    function getNoPublicSetsMsg() {
        return page.noPublicSetsMsg;
    }

    function getPublicJoinBtn(set) {
        return set.element(by.css(page.publicJoinBtn));
    }

    function getPublicOptOutBtn(set) {
        return set.element(by.css(page.publicOptOutBtn));
    }

    function getPublicSets() {
        return page.publicSets;
    }

    function getPublicViewBtn(set) {
        return set.element(by.css(page.publicViewBtn));
    }

    function getSearchBox() {
        return page.searchBox;
    }

    async function getSetName(setElement) {
        return await setElement.element(by.css(page.setName)).getText();
    }

    async function isSetPublic(set) {
        const text = await set.getText();
        if (text.indexOf('Public') > -1) {
            return true;
        }

        return false;
    }

    async function saveNewSet() {
        await page.saveNewSetBtn.click();
    }

    async function submitAdminUser() {
        await page.submitAdminUserBtn.click();
    }

    async function toggleAdminViewAllSets() {
        await page.adminViewAllToggle.click();
    }

    async function togglePublicSets() {
        await page.togglePublicSetsBtn.click();
    }

    async function updateSet(setElement) {
        await setElement.element(by.partialButtonText(page.saveUpdatedSetText)).click();
    }
};

module.exports = ViewSetsPage;