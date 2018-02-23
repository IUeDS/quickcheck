var TextmatchQuestionComponent = function(browserRef, question) {
    var component = this;
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

    function addTextmatchAnswer() {
        component.addTextmatchAnswerBtn.click();
    }

    function enterTextMatchOption(option, text) {
        option.element(by.css(component.inputElement)).sendKeys(text);
    }

    function getOptionInput(option) {
        return option.element(by.css(component.inputElement));
    }
}

module.exports = TextmatchQuestionComponent;