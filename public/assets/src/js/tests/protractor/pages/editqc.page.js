var EditQcPage = function(browserRef) {
    var page = this,
        EC = protractor.ExpectedConditions;

    page.browser = browserRef;
    page.includes = require('../common/includes.js');

    //sub-components
    page.nav = new page.includes.NavComponent(page.browser);
    page.questions = [];

    //elements
    page.addQuestionBtn = page.browser.element(by.partialButtonText('Add question'));
    page.backBtn = page.browser.element(by.partialLinkText('Back'));
    page.customActivities = page.browser.element.all(by.repeater('customActivity in vm.customActivities'));
    page.customBtn = page.browser.element(by.partialButtonText('Make this a custom activity'));
    page.customDropdown = page.browser.element(by.css('#custom-activity'));
    page.customName = page.browser.element(by.exactBinding('vm.customActivity.name'));
    page.deleteCustomBtn = page.browser.element(by.partialButtonText('Remove custom activity'));
    page.descriptionInput = page.browser.element(by.model('vm.assessment.description'));
    page.goBackToSetLink = page.browser.element(by.cssContainingText('a', 'Return to set'));
    page.nameInput = page.browser.element(by.model('vm.assessment.name'));
    page.questionsList = page.browser.element.all(by.repeater('question in vm.questions'));
    page.readOnlyNotice = page.browser.element(by.css('.read-only-notice'));
    page.saveBtn = page.browser.element(by.css('.qc-btn-save-quiz'));
    page.saveErrorMsg = page.browser.element(by.css('.alert-danger'));
    page.saveSuccessMsg = page.browser.element(by.css('.alert-success'));
    page.subsetInput = page.browser.element(by.model('vm.assessment.assessment_group_id'));
    page.subsetOptions = page.browser.element(by.model('vm.assessment.assessment_group_id')).all(by.css('option'));
    page.titleInput = page.browser.element(by.model('vm.assessment.title'));

    //functions
    page.addQuestion = addQuestion;
    page.areInputsDisabled = areInputsDisabled;
    page.getAssessmentName = getAssessmentName;
    page.getCurrentSubset = getCurrentSubset;
    page.getCustomActivities = getCustomActivities;
    page.getCustomBtn = getCustomBtn;
    page.getCustomDropdown = getCustomDropdown;
    page.getCustomName = getCustomName;
    page.deleteCustom = deleteCustom;
    page.getCustomDeleteBtn = getCustomDeleteBtn;
    page.getDescriptionInput = getDescriptionInput;
    page.getNameInput = getNameInput;
    page.getQuestion = getQuestion;
    page.getQuestions = getQuestions;
    page.getSaveBtn = getSaveBtn
    page.getSaveError = getSaveError;
    page.getSaveSuccess = getSaveSuccess;
    page.getSubsetOptions = getSubsetOptions;
    page.getSubsetSelect = getSubsetSelect;
    page.getTitleInput = getTitleInput;
    page.goBack = goBack;
    page.goBackToSet = goBackToSet;
    page.initQuestions = initQuestions;
    page.isReadOnly = isReadOnly;
    page.save = save;

    async function addQuestion(questionType) {
        var newQuestion,
            questionCount,
            questionObject;

        await page.addQuestionBtn.click();
        //fetches by index, thus current length = new last index
        questionCount = page.questions.length;
        newQuestion = page.getQuestions().get(questionCount);
        questionObject = new page.includes.EditQuestionComponent(page.browser, newQuestion, questionType);
        //set the question type in the dropdown, but not multiple choice, since that's the default, and
        //changing the question type removes current options, requiring us to re-add what's already there
        if (questionType && questionType !== page.includes.data.questionTypes.mc) {
            questionObject.setQuestionType(questionType);
        }
        page.questions.push(questionObject);
    }

    async function areInputsDisabled() {
        var inputsDisabled = true;

        await page.browser.element.all(by.css('input')).each(async function(input) {
            if (!await input.getAttribute('disabled')) {
                inputsDisabled = false;
            }
        });

        return inputsDisabled;
    }

    async function deleteCustom() {
        await page.deleteCustomBtn.click();
    }

    async function getAssessmentName() {
        return await page.nameInput.getAttribute('value');
    }

    async function getCurrentSubset() {
        return await page.subsetInput.element(by.css('option:checked')).getText();
    }

    function getCustomActivities() {
        return page.customActivities;
    }

    function getCustomBtn() {
        return page.customBtn;
    }

    function getCustomDeleteBtn() {
        return page.deleteCustomBtn;
    }

    function getCustomDropdown() {
        return page.customDropdown;
    }

    async function getCustomName() {
        return await page.customName.getText();
    }

    function getDescriptionInput() {
        return page.descriptionInput;
    }

    function getNameInput() {
        return page.nameInput;
    }

    function getQuestion(index) {
        return page.questions[index];
    }

    function getQuestions() {
        return page.questionsList;
    }

    function getSaveBtn() {
        return page.saveBtn;
    }

    function getSaveError() {
        return page.saveErrorMsg;
    }

    function getSaveSuccess() {
        return page.saveSuccessMsg;
    }

    function getSubsetOptions() {
        return page.subsetOptions;
    }

    function getSubsetSelect() {
        return page.subsetInput;
    }

    function getTitleInput() {
        return page.titleInput;
    }

    async function goBack() {
        await page.backBtn.click();
        await page.browser.sleep(1000);
    }

    async function goBackToSet() {
        await page.goBackToSetLink.click();
        await page.browser.sleep(1000);
    }

    async function initQuestions() {
        page.questions = []; //clear if any were previously saved
        const questions = await page.getQuestions();
        for (const [index, question] of questions.entries()) {
            var questionElement = page.getQuestions().get(index),
                questionObject = new page.includes.EditQuestionComponent(page.browser, questionElement),
                questionType = await questionObject.getQuestionType();

            questionObject.composeQuestionType(questionType);
            page.questions.push(questionObject);
        }
    }

    async function isReadOnly() {
        return await page.readOnlyNotice.isPresent();
    }

    async function save() {
        await page.saveBtn.click();
        await page.browser.waitForAngular();
        await page.browser.sleep(1500); //1/08/17: recent protractor issues require workarounds
    }
}

module.exports = EditQcPage;