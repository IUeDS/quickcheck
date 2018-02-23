var McQuestionComponent = function(browserRef, question) {
    var component = this;
    component.browser = browserRef;
    component.question = question;

    //elements
    component.addMcOptionBtn = component.question.element(by.partialButtonText('Add option'));
    //strings for sub-elements
    component.inputElement = 'input';
    component.mcIsCorrectClass = '.qc-selected-correct';
    component.mcMarkCorrectClass = '.qc-correct-symbol';

    //functions
    component.addMcOption = addMcOption;
    component.enterMcTextOption = enterMcTextOption;
    component.getMcOptionInputValue = getMcOptionInputValue;
    component.getOptionInput = getOptionInput;
    component.isMcOptionMarkedCorrect = isMcOptionMarkedCorrect;
    component.toggleMcOptionCorrect = toggleMcOptionCorrect;

    function addMcOption() {
        component.addMcOptionBtn.click();
    }

    function enterMcTextOption(option, text) {
        option.element(by.css(component.inputElement)).sendKeys(text);
    }

    function getMcOptionInputValue(option) {
        return option.element(by.css(component.inputElement)).getAttribute('value');
    }

    function getOptionInput(option) {
        return option.element(by.css(component.inputElement));
    }

    function isMcOptionMarkedCorrect(option) {
        return option.element(by.css(component.mcIsCorrectClass)).isPresent();
    }

    function toggleMcOptionCorrect(option) {
        option.element(by.css(component.mcMarkCorrectClass)).click();
    }
}

module.exports = McQuestionComponent;