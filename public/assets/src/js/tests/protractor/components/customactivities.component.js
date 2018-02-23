var CustomActivitiesComponent = function(browserRef) {
    var component = this;
    component.browser = browserRef;

    //elements
    component.activities = component.browser.element.all(by.repeater('customActivity in vm.customActivities'));
    component.addActivityBtn = component.browser.element(by.partialButtonText('Add custom activity'));
    component.closeBtn = component.browser.element(by.partialButtonText('Close'));
    component.newDescriptionInput = component.browser.element(by.css('#custom-add-description'));
    component.newDevInput = component.browser.element(by.css('#developer'));
    component.newNameInput = component.browser.element(by.css('#name'));
    component.newUrlInput = component.browser.element(by.css('#url'));
    component.noneCreated = component.browser.element(by.css('.qc-custom-none-added'));
    component.openBtn = component.browser.element(by.partialButtonText('Manage custom activities'));
    component.panel = component.browser.element(by.css('.custom-activities-panel'));
    component.saveNewBtn = component.browser.element(by.partialButtonText('Save custom activity'));
    component.successMsg = component.panel.element(by.css('.alert-success'));

    //sub-string selectors
    component.deleteBtn = '.qc-custom-activity-delete-btn';
    component.descriptionBinding = 'vm.customActivity.description';
    component.devBinding = 'vm.customActivity.developer';
    component.editBtn = '.qc-custom-activity-edit-btn';
    component.editDescriptionInput = '#edit-custom-description';
    component.editDevInput = '#edit-custom-developer';
    component.editGroupInput = '#edit-custom-group';
    component.editNameInput = '#edit-custom-name';
    component.editUrlInput = '#edit-custom-url';
    component.nameBinding = 'vm.customActivity.name';
    component.submitEditBtn = '.btn-success';
    component.urlBinding = 'vm.customActivity.url';

    //functions
    component.addActivity = addActivity;
    component.areNoneCreated = areNoneCreated;
    component.close = close;
    component.deleteActivity = deleteActivity;
    component.editActivity = editActivity;
    component.getActivities = getActivities;
    component.getDescription = getDescription;
    component.getDev = getDev
    component.getEditedDescriptionInput = getEditedDescriptionInput;
    component.getEditedDevInput = getEditedDevInput;
    component.getEditedGroupRequired = getEditedGroupRequired;
    component.getEditedNameInput = getEditedNameInput;
    component.getEditedUrlInput = getEditedUrlInput;
    component.getName = getName;
    component.getNewDescriptionInput = getNewDescriptionInput;
    component.getNewDevInput = getNewDevInput;
    component.getNewNameInput = getNewNameInput;
    component.getNewUrlInput = getNewUrlInput;
    component.getSuccessMsg = getSuccessMsg;
    component.getUrl = getUrl;
    component.isGroupRequired = isGroupRequired;
    component.isOpen = isOpen;
    component.open = open;
    component.submitEdited = submitEdited
    component.submitNew = submitNew;

    function addActivity() {
        component.addActivityBtn.click();
    }

    function areNoneCreated() {
        return component.noneCreated.isPresent();
    }

    function close() {
        component.closeBtn.click();
    }

    function deleteActivity(activity) {
        activity.element(by.css(component.deleteBtn)).click();
    }

    function editActivity(activity) {
        activity.element(by.css(component.editBtn)).click();
    }

    function getActivities() {
        return component.activities;
    }

    function getDescription(activity) {
        return activity.element(by.exactBinding(component.descriptionBinding)).getText();
    }

    function getDev(activity) {
        return activity.element(by.exactBinding(component.devBinding)).getText();
    }

    function getEditedDescriptionInput(activity) {
        return activity.element(by.css(component.editDescriptionInput));
    }

    function getEditedDevInput(activity) {
        return activity.element(by.css(component.editDevInput));
    }

    function getEditedGroupRequired(activity) {
        return activity.element(by.css(component.editGroupInput));
    }

    function getEditedNameInput(activity) {
        return activity.element(by.css(component.editNameInput));
    }

    function getEditedUrlInput(activity) {
        return activity.element(by.css(component.editUrlInput));
    }

    function getName(activity) {
        return activity.element(by.exactBinding(component.nameBinding)).getText();
    }

    function getNewDescriptionInput() {
        return component.newDescriptionInput;
    }

    function getNewDevInput() {
        return component.newDevInput;
    }

    function getNewNameInput() {
        return component.newNameInput;
    }

    function getNewUrlInput() {
        return component.newUrlInput;
    }

    function getSuccessMsg() {
        return component.successMsg;
    }

    function getUrl(activity) {
        return activity.element(by.exactBinding(component.urlBinding)).getText();
    }

    function isGroupRequired(activity) {
        //there's a label showing group required that is only present if group required box checked
        return activity.getText().then(function(text) {
            if (text.indexOf('Group required') > -1) {
                return true;
            }
            else {
                return false;
            }
        });
    }

    function isOpen() {
        return component.panel.isPresent();
    }

    function open() {
        component.openBtn.click();
    }

    function submitEdited(activity) {
        activity.element(by.css(component.submitEditBtn)).click();
    }

    function submitNew() {
        component.saveNewBtn.click();
    }
}

module.exports = CustomActivitiesComponent;