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

    function addQuestion(questionType) {
        var newQuestion,
            questionCount,
            questionObject;

        page.addQuestionBtn.click();
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

    function areInputsDisabled() {
        var inputsDisabled = true;

        return page.browser.element.all(by.css('input')).each(function(input) {
            if (!input.getAttribute('disabled')) {
                inputsDisabled = false;
            }
        }).then(function() {
            return inputsDisabled;
        });
    }

    function deleteCustom() {
        page.deleteCustomBtn.click();
    }

    function getAssessmentName() {
        return page.nameInput.getAttribute('value');
    }

    function getCurrentSubset() {
        return page.subsetInput.element(by.css('option:checked')).getText();
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

    function getCustomName() {
        return page.customName.getText();
    }

    function getDescriptionInput() {
        return page.descriptionInput;
    }

    function getNameInput() {
        return page.nameInput;
    }

    function getQuestion(index) {
        return this.questions[index];
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

    function goBack() {
        page.backBtn.click();
        page.browser.sleep(1000);
    }

    function goBackToSet() {
        page.goBackToSetLink.click();
        page.browser.sleep(1000);
    }

    function initQuestions() {
        page.questions = []; //clear if any were previously saved
        //this. this right here. took me most of a day. constructing the question objects with composable
        //question type behavior is much more difficult to set up when editing a previously saved quick check.
        //we have to reverse-engineer the question type based on what is in the select element, and compose
        //based on that. protractor was ridiculously meticulous about how to set this up so that the element
        //saved in each constructed class was the element itself, rather than some sort of iterator that only
        //gave me the most recently found element rather than what was originally found. also, this may look
        //a little funny, getting all questions, then only getting one based on index, but the count() method
        //also returns a promise, so a plain for loop using count as a stopping point also requires a closure.
        return page.getQuestions().then(function(questions) {
            questions.forEach(function(question, index) {
                var question = page.getQuestions().get(index),
                    questionObject = new page.includes.EditQuestionComponent(page.browser, question);
                questionObject.getQuestionType().then(function(questionType) {
                    questionObject.composeQuestionType(questionType);
                    page.questions.push(questionObject);
                });
            });
        });
    }

    function isReadOnly() {
        return page.readOnlyNotice.isPresent();
    }

    function save() {
        page.saveBtn.click();
        page.browser.waitForAngular();
        page.browser.sleep(1000); //1/08/17: recent protractor issues require workarounds
    }
}

module.exports = EditQcPage;