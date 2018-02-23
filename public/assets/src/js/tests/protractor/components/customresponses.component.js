var CustomResponsesComponent = function(browserRef) {
    var component = this;
    component.browser = browserRef;

    //elements
    component.responses = component.browser.element.all(by.repeater('response in vm.studentResponses'));
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

    function getAnswer(responseIndex) {
        var response = component.responses.get(responseIndex);
        return response.element(by.css(component.answer)).getText();
    }

    function getAnswerKey(responseIndex) {
        var response = component.responses.get(responseIndex);
        return response.element(by.css(component.answerKey)).getText();
    }

    function getQuestion(responseIndex) {
        var response = component.responses.get(responseIndex);
        return response.element(by.css(component.question)).getText();
    }

    function getResponses() {
        return component.responses;
    }

    function isCorrect(responseIndex) {
        var response = component.responses.get(responseIndex);
        return response.element(by.css(component.correctIcon)).isPresent();
    }

    function isResponseTable() {
        return component.responsesTable.isPresent();
    }

};

module.exports = CustomResponsesComponent;