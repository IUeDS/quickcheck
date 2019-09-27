var TextmatchQuestionComponent = function(browserRef, question) {
    var component = this,
        EC = protractor.ExpectedConditions;
    component.browser = browserRef;
    component.question = question;

    //elements
    component.addTextmatchAnswerBtn = component.question.element(by.partialButtonText('Add possible answer'));

    //strings for sub-elements
    component.inputElement = 'input[type="text"]';

    //functions
    component.addTextmatchAnswer = addTextmatchAnswer;
    component.enterTextMatchOption = enterTextMatchOption;
    component.getOptionInput = getOptionInput;

    async function addTextmatchAnswer() {
        await component.browser.wait(EC.elementToBeClickable(component.addTextmatchAnswerBtn), 5000);
        await component.addTextmatchAnswerBtn.click();
    }

    async function enterTextMatchOption(option, text) {
        await option.element(by.css(component.inputElement)).sendKeys(text);
    }

    function getOptionInput(option) {
        return option.element(by.css(component.inputElement));
    }
}

module.exports = TextmatchQuestionComponent;