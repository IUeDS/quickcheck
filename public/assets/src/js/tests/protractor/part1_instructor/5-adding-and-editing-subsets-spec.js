var includes = require('../common/includes.js'),
    common = new includes.Common(browser),
    sets = includes.data.sets,
    setPage = new includes.SetPage(browser);

describe('Adding a subset to a set', function () {
    var subsetInput,
        name,
        subset;

    it('should show the necessary form when the button is clicked', async function () {
        await setPage.addSubset();
        subsetInput = await setPage.getNewSubsetInput();
        expect(await subsetInput.isDisplayed()).toBe(true);
    });

    it('should add the subset to the list on the page when saved', async function () {
        name = sets.toBeDeleted.subsets.group1;
        await subsetInput.sendKeys(name);
        await setPage.saveNewSubset();
        expect(await setPage.getSubset(0).getName()).toBe(name.toUpperCase());
    });

    it('should initially show instructions for adding a quick check', async function () {
        subset = setPage.getSubset(0);
        expect(await subset.areSubsetInstructionsVisible()).toBe(true);
    });

    it('should have a functioning accordion for the subset', async function () {
        await subset.toggleAccordion();
        expect(await subset.areSubsetInstructionsVisible()).toBe(false);
        await subset.toggleAccordion();
        expect(await subset.areSubsetInstructionsVisible()).toBe(true);
    });
});

describe('Editing the name of a subset', function () {
    var name,
        subset,
        subsetInput;

    beforeEach(function() {
        subset = setPage.getSubset(0);
    });

    it('should show the necessary form when the button is clicked', async function () {
        name = sets.toBeDeleted.subsets.group1;
        await subset.editSubset();
        subsetInput = subset.getEditSubsetInput();
        expect(await subsetInput.getAttribute('value')).toBe(name);
    });

    it('should show the updated name after saving', async function () {
        await subsetInput.clear();
        sets.toBeDeleted.subsets.group1 = 'Edited subset';
        name = sets.toBeDeleted.subsets.group1;
        await subset.submitEditedSubset(name);
        expect(await subset.getName()).toBe(name.toUpperCase());
    });
});

describe('Adding a quick check to a subset', function () {
    var nameInput,
        name,
        quickchecks,
        subset;

    beforeEach(function() {
        name =  sets.toBeDeleted.quickchecks.test;
        subset = setPage.getSubset(0);
    });

    it('should show the necessary form when the button is clicked', async function () {
        await subset.addQuickCheck();
        nameInput = subset.getNewQcInput();
        expect(await nameInput.isDisplayed()).toBe(true);
    });

    it('should add the quick check to the subset when saved', async function () {
        await nameInput.sendKeys(name);
        await subset.saveQuickCheck();
        quickchecks = subset.getQuickChecks();
        expect(await quickchecks.count()).toBe(1);
        expect(await quickchecks.get(0).getText()).toContain(name);
    });
});