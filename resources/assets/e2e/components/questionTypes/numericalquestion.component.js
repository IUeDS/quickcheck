var NumericalQuestionComponent = function(browserRef, question) {
    var component = this;
    component.browser = browserRef;
    component.question = question;

    //elements
    component.addNumericalAnswerBtn = component.question.element(by.partialButtonText('Add possible answer'));

    //strings for sub-elements
    component.answerTypeElement = 'option.answer_type';
    component.exactAnswerElement = 'option.numerical_answer';
    component.marginOfErrorElement = 'option.margin_of_error';
    component.rangeMinElement = 'option.range_min';
    component.rangeMaxElement = 'option.range_max';

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
        await component.addNumericalAnswerBtn.click();
    }

    async function enterNumericalExactOption(option, answer, marginOfError) {
        await option.element(by.model(component.exactAnswerElement)).sendKeys(answer);
        await option.element(by.model(component.marginOfErrorElement)).sendKeys(marginOfError);
    }

    async function enterNumericalRangeOption(option, rangeMin, rangeMax) {
        await option.element(by.model(component.rangeMinElement)).sendKeys(rangeMin);
        await option.element(by.model(component.rangeMaxElement)).sendKeys(rangeMax);
    }

    function getExactAnswerInput(option) {
        return option.element(by.model(component.exactAnswerElement));
    }

    function getMarginOfErrorInput(option) {
        return option.element(by.model(component.marginOfErrorElement));
    }

    function getRangeMinInput(option) {
        return option.element(by.model(component.rangeMinElement));
    }

    function getRangeMaxInput(option) {
        return option.element(by.model(component.rangeMaxElement));
    }

    async function setOptionAsExactAnswer(option) {
        await option.element(by.model(component.answerTypeElement)).sendKeys('Exact');
    }

    async function setOptionAsRange(option) {
        await option.element(by.model(component.answerTypeElement)).sendKeys('Answer in the range');
    }
}

module.exports = NumericalQuestionComponent;