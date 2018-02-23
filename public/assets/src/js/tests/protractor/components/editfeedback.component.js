var EditFeedbackComponent = function(browserRef, question) {
    var component = this,
        EC = protractor.ExpectedConditions;

    component.browser = browserRef;
    component.question = question;

    //elements
    component.correctFeedback = component.question.element(by.css('.qc-custom-feedback-correct textarea'));
    component.correctFeedbackContainer = component.question.element(by.css('.qc-custom-feedback-correct'));
    component.customFeedbackBtn = component.question.element(by.css('.qc-btn-add-feedback'))
    component.customFeedbackPanel = component.question.element(by.css('.qc-custom-feedback-container'));
    component.deleteFeedbackBtn = component.question.element(by.css('.qc-delete-feedback-btn'));
    component.incorrectFeedback = component.question.element(by.css('.qc-custom-feedback-incorrect textarea'));
    component.questionLevelFeedbackContainer = component.question.element(by.css('.qc-custom-feedback-general'));
    component.perResponseFeedbackCheckbox = component.question.element(by.css('.qc-custom-feedback-response-checkbox input'));
    component.perResponseFeedbackOptions = component.customFeedbackPanel.all(by.repeater('option in vm.question.options'));
    component.richContentToggle = component.customFeedbackPanel.element(by.css('.qc-rich-content-toggle label'));

    //strings for sub-elements
    component.perResponseFeedbackCorrectClass = 'qc-custom-feedback-correct';
    component.perResponseFeedbackInput = 'option.mc_option_feedback.feedback_text';

    //functions
    component.addCustomFeedback = addCustomFeedback;
    component.deleteFeedback = deleteFeedback;
    component.enterResponseFeedback = enterResponseFeedback;
    component.getCorrectFeedback = getCorrectFeedback;
    component.getCorrectFeedbackContainer = getCorrectFeedbackContainer;
    component.getFeedbackPanel = getFeedbackPanel;
    component.getIncorrectFeedback = getIncorrectFeedback;
    component.getPerResponseFeedbackCheckbox = getPerResponseFeedbackCheckbox;
    component.getPerResponseFeedbackInput = getPerResponseFeedbackInput;
    component.getPerResponseFeedbackOptions = getPerResponseFeedbackOptions;
    component.getPerResponseFeedbackText = getPerResponseFeedbackText;
    component.getQuestionLevelFeedbackContainer = getQuestionLevelFeedbackContainer;
    component.getRichContentToggle = getRichContentToggle;
    component.isFeedbackOptionMarkedCorrect = isFeedbackOptionMarkedCorrect;
    component.togglePerResponseFeedback = togglePerResponseFeedback;
    component.toggleRichContent = toggleRichContent;

    function addCustomFeedback() {
        component.customFeedbackBtn.click();
    }

    function deleteFeedback() {
        component.browser.sleep(500); //1/08/17: recent protractor issues require workarounds
        component.deleteFeedbackBtn.click();
        component.browser.sleep(500); //was throwing an error without this
    }

    function enterResponseFeedback(option, text) {
        option.element(by.model(component.perResponseFeedbackInput)).sendKeys(text);
    }

    function getCorrectFeedback() {
        return component.correctFeedback;
    }

    //need this to find the tinymce iframe when rich content is toggled on
    function getCorrectFeedbackContainer() {
        return component.correctFeedbackContainer;
    }

    function getFeedbackPanel() {
        return component.customFeedbackPanel;
    }

    function getIncorrectFeedback() {
        return component.incorrectFeedback;
    }

    function getPerResponseFeedbackCheckbox() {
        return component.perResponseFeedbackCheckbox;
    }

    function getPerResponseFeedbackInput(responseFeedback) {
        return responseFeedback.element(by.css('textarea'));
    }

    function getPerResponseFeedbackOptions() {
        return component.perResponseFeedbackOptions;
    }

    function getPerResponseFeedbackText(responseFeedback) {
        return responseFeedback.element(by.model(component.perResponseFeedbackInput)).getAttribute('value');
    }

    function getQuestionLevelFeedbackContainer() {
        return component.questionLevelFeedbackContainer;
    }

    function getRichContentToggle() {
        return component.richContentToggle;
    }

    function isFeedbackOptionMarkedCorrect(option) {
        return option.getAttribute('class').then(function(val) {
            if (val.indexOf(component.perResponseFeedbackCorrectClass) > -1) {
                return true;
            }
            return false;
        });
    }

    function togglePerResponseFeedback() {
        component.perResponseFeedbackCheckbox.click();
    }

    function toggleRichContent() {
        component.richContentToggle.click();
    }
}

module.exports = EditFeedbackComponent;