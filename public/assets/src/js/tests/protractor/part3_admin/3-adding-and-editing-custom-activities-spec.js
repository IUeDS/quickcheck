var browser3 = browser.params.browser3, //define browser instance from global value
    includes = require('../common/includes.js'),
    data = includes.data,
    viewSetsPage = new includes.ViewSetsPage(browser3);

describe('Adding custom activities', function() {
    var custom = viewSetsPage.customActivities, //for easier typing
        customData = data.customActivity;

    it('should show the proper form when the custom activities button is clicked', function() {
        custom.open();
        expect(custom.isOpen()).toBe(true);
    });

    it('should hide the form when the close button is clicked', function() {
        custom.close();
        expect(custom.isOpen()).toBe(false);
    })

    it('should initially show a message saying no custom activities have been added yet', function() {
        custom.open();
        expect(custom.areNoneCreated()).toBe(true);
    });

    it('should show the proper form when the add custom button is clicked', function() {
        custom.addActivity();
        expect(custom.getNewNameInput().isDisplayed()).toBe(true);
    });

    it('should throw a validation error when the url is not included', function() {
        custom.getNewNameInput().sendKeys(customData.name);
        custom.submitNew();
        expect(custom.getSuccessMsg().isPresent()).toBe(false);
    });

    it('should add the newly added custom activity to the list', function() {
        custom.getNewUrlInput().sendKeys(customData.url);
        custom.getNewDescriptionInput().sendKeys(customData.description);
        custom.getNewDevInput().sendKeys(customData.dev);
        custom.submitNew();
        expect(custom.areNoneCreated()).toBe(false);
        expect(custom.getActivities().count()).toBe(1);
        expect(custom.getActivities().get(0).getText()).toContain(customData.name);
    });
});

describe('Editing custom activities', function() {
    var custom = viewSetsPage.customActivities, //for easier typing
        customData = data.customActivity,
        activity = custom.getActivities().get(0);

    it('should show the correct name when edited', function() {
        custom.editActivity(activity);
        expect(custom.getEditedNameInput(activity).getAttribute('value')).toBe(customData.name);
    });

    it('should show the correct description when edited', function() {
        expect(custom.getEditedDescriptionInput(activity).getAttribute('value')).toBe(customData.description);
    });

    it('should show the correct url when edited', function() {
        expect(custom.getEditedUrlInput(activity).getAttribute('value')).toBe(customData.url);
    });

    it('should show the correct developer when edited', function() {
        expect(custom.getEditedDevInput(activity).getAttribute('value')).toBe(customData.dev);
    });

    it('should correctly show group required when edited', function() {
        expect(custom.getEditedGroupRequired(activity).getAttribute('checked')).toBeFalsy();
    });


    it('should show the edited name after saving edits', function() {
        //change all fields (update info from the data file as well so it's current)
        customData.name = customData.name + ' edited';
        customData.description = customData.description + ' edited';
        customData.url = 'psych101/C1-4/activities/brain/brain.html';
        customData.dev = customData.dev + ' edited';

        custom.getEditedNameInput(activity).clear().sendKeys(customData.name);
        custom.getEditedDescriptionInput(activity).clear().sendKeys(customData.description);
        custom.getEditedUrlInput(activity).clear().sendKeys(customData.url);
        custom.getEditedDevInput(activity).clear().sendKeys(customData.dev);
        custom.getEditedGroupRequired(activity).click();
        custom.submitEdited(activity);

        expect(custom.getName(activity)).toBe(customData.name.toUpperCase());
    });

    it('should show the edited description after saving edits', function() {
        expect(custom.getDescription(activity)).toContain(customData.description);
    });

    it('should show the edited url after saving edits', function() {
        expect(custom.getUrl(activity)).toContain(customData.url);
    });

    it('should show the edited developer after saving edits', function() {
        expect(custom.getDev(activity)).toContain(customData.dev);
    });

    it('should show that group is required after saving edits', function() {
        expect(custom.isGroupRequired(activity)).toBe(true);
    });
});

describe('Deleting custom activities', function() {
    var custom = viewSetsPage.customActivities; //for easier typing

    it('should remove the custom activity from the list after being deleted', function() {
        //add a new one to throw away
        custom.addActivity();
        custom.getNewNameInput().sendKeys('Whatever');
        custom.getNewDescriptionInput().sendKeys('Whatever');
        custom.getNewUrlInput().sendKeys('https://google.com');
        custom.getNewDevInput().sendKeys('Man of mystery');
        custom.submitNew();

        custom.deleteActivity(custom.getActivities().get(1));
        expect(custom.getActivities().count()).toBe(1);
    });
});