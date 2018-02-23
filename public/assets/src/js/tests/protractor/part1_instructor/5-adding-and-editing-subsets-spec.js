var includes = require('../common/includes.js'),
    common = new includes.Common(browser),
    sets = includes.data.sets,
    setPage = new includes.SetPage(browser);

describe('Adding a subset to a set', function () {
    var subsetInput,
        name,
        subset;

    it('should show the necessary form when the button is clicked', function () {
        setPage.addSubset();
        subsetInput = setPage.getNewSubsetInput();
        expect(subsetInput.isDisplayed()).toBe(true);
    });

    it('should add the subset to the list on the page when saved', function () {
        name = sets.toBeDeleted.subsets.group1;
        subsetInput.sendKeys(name);
        setPage.saveNewSubset().then(function() {
            expect(setPage.getSubset(0).getName()).toBe(name.toUpperCase());
        });
    });

    it('should initially show instructions for adding a quick check', function () {
        subset = setPage.getSubset(0);
        expect(subset.areSubsetInstructionsVisible()).toBe(true);
    });

    it('should have a functioning accordion for the subset', function () {
        subset.toggleAccordion();
        expect(subset.areSubsetInstructionsVisible()).toBe(false);
        subset.toggleAccordion();
        expect(subset.areSubsetInstructionsVisible()).toBe(true);
    });
});

describe('Editing the name of a subset', function () {
    var name,
        subset,
        subsetInput;

    beforeEach(function() {
        subset = setPage.getSubset(0);
    });

    it('should show the necessary form when the button is clicked', function () {
        name = sets.toBeDeleted.subsets.group1;
        subset.editSubset();
        subsetInput = subset.getEditSubsetInput();
        expect(subsetInput.getAttribute('value')).toBe(name);
    });

    it('should show the updated name after saving', function () {
        subsetInput.clear();
        sets.toBeDeleted.subsets.group1 = 'Edited subset';
        name = sets.toBeDeleted.subsets.group1;
        subset.submitEditedSubset(name);
        expect(subset.getName()).toBe(name.toUpperCase());
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

    it('should show the necessary form when the button is clicked', function () {
        subset.addQuickCheck();
        nameInput = subset.getNewQcInput();
        expect(nameInput.isDisplayed()).toBe(true);
    });

    it('should add the quick check to the subset when saved', function () {
        nameInput.sendKeys(name);
        subset.saveQuickCheck();
        quickchecks = subset.getQuickChecks();
        expect(quickchecks.count()).toBe(1);
        expect(quickchecks.get(0).getText()).toContain(name);
    });
});