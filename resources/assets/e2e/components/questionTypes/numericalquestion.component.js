var NumericalQuestionComponent = function(browserRef, question) {
    var component = this,
        EC = protractor.ExpectedConditions;
    component.browser = browserRef;
    component.question = question;

    //elements
    component.addNumericalAnswerBtn = component.question.element(by.partialButtonText('Add possible answer'));

    //strings for sub-elements
    component.answerTypeElement = '.qc-edit-numerical-answer-type';
    component.exactAnswerElement = '.qc-edit-numerical-answer';
    component.marginOfErrorElement = '.qc-edit-numerical-margin';
    component.rangeMinElement = '.qc-edit-numerical-range-min';
    component.rangeMaxElement = '.qc-edit-numerical-range-max';

    //functions
    component.addNumericalAnswer = addNumericalAnswer;
    component.enterNumericalExactOption = enterNumericalExactOption;
    component.enterNumericalRangeOption = enterNumericalRangeOption;
    component.getExactAnswerInput = getExactAnswerInput;
    component.getMarginOfErrorInput = getMarginOfErrorInput;
    component.getRangeMinInput = getRangeMinInput;
    component.getRangeMaxInput = getRangeMaxInput;
    component.setOptionAsExactAnswer = setOptionAsExactAnswer;
    component.setOptionAsRange = setOptionAsRange;

    async function addNumericalAnswer() {
        await component.browser.wait(EC.elementToBeClickable(component.addNumericalAnswerBtn), 5000);
        await component.addNumericalAnswerBtn.click();
    }

    async function enterNumericalExactOption(option, answer, marginOfError) {
        await option.element(by.css(component.exactAnswerElement)).sendKeys(answer);
        await option.element(by.css(component.marginOfErrorElement)).sendKeys(marginOfError);
    }

    async function enterNumericalRangeOption(option, rangeMin, rangeMax) {
        await option.element(by.css(component.rangeMinElement)).sendKeys(rangeMin);
        await option.element(by.css(component.rangeMaxElement)).sendKeys(rangeMax);
    }

    function getExactAnswerInput(option) {
        return option.element(by.css(component.exactAnswerElement));
    }

    function getMarginOfErrorInput(option) {
        return option.element(by.css(component.marginOfErrorElement));
    }

    function getRangeMinInput(option) {
        return option.element(by.css(component.rangeMinElement));
    }

    function getRangeMaxInput(option) {
        return option.element(by.css(component.rangeMaxElement));
    }

    async function setOptionAsExactAnswer(option) {
        await option.element(by.css(component.answerTypeElement)).sendKeys('Exact');
    }

    async function setOptionAsRange(option) {
        await option.element(by.css(component.answerTypeElement)).sendKeys('Answer in the range');
    }
}

module.exports = NumericalQuestionComponent;