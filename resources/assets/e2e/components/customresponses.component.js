var CustomResponsesComponent = function(browserRef) {
    var component = this;
    component.browser = browserRef;

    //elements
    component.responses = component.browser.element.all(by.css('.qc-responses-custom-response'));
    component.responsesTable = component.browser.element(by.css('.qc-responses-table'));

    //sub-string elements
    component.answer = '.qc-response-answer';
    component.answerKey = '.qc-response-answer-key';
    component.correctIcon = '.fa-check';
    component.question = '.qc-response-question';

    //functions
    component.getAnswer = getAnswer;
    component.getAnswerKey = getAnswerKey
    component.getQuestion = getQuestion;
    component.getResponses = getResponses;
    component.isCorrect = isCorrect;
    component.isResponseTable = isResponseTable;

    async function getAnswer(responseIndex) {
        var response = component.responses.get(responseIndex);
        return await response.element(by.css(component.answer)).getText();
    }

    async function getAnswerKey(responseIndex) {
        var response = component.responses.get(responseIndex);
        return await response.element(by.css(component.answerKey)).getText();
    }

    async function getQuestion(responseIndex) {
        var response = component.responses.get(responseIndex);
        return await response.element(by.css(component.question)).getText();
    }

    function getResponses() {
        return component.responses;
    }

    async function isCorrect(responseIndex) {
        var response = component.responses.get(responseIndex);
        return await response.element(by.css(component.correctIcon)).isPresent();
    }

    async function isResponseTable() {
        return await component.responsesTable.isPresent();
    }

};

module.exports = CustomResponsesComponent;