var AttemptsTableComponent = function(browserRef) {
    var component = this,
        EC = protractor.ExpectedConditions;
    component.browser = browserRef;

    //elements
    component.attempts = component.browser.element.all(by.repeater('attempt in vm.attempts'));
    component.backBtn = component.browser.element(by.partialLinkText('Back'));

    //sub-string selectors
    component.completed = '.qc-attempt-completed';
    component.correct = '.qc-attempt-count-correct';
    component.editGradeLink = '.qc-edit-grade';
    component.gradeArea = '.qc-attempt-grade';
    component.gradeError = '.alert-danger';
    component.gradeInput = '.qc-grade-submit-input';
    component.incorrect = '.qc-attempt-count-incorrect';
    component.name = '.qc-attempt-name';
    component.pastDue = '.qc-attempt-late';
    component.responsesBtn = '.qc-btn-view-responses';
    component.score = '.qc-attempt-calculated-score';
    component.submitGradeBtn = 'Submit';

    //functions
    component.getAttempts = getAttempts;
    component.getAttemptsVisible = getAttemptsVisible;
    component.getCorrect = getCorrect;
    component.getEditGradeLink = getEditGradeLink;
    component.getGradeArea = getGradeArea;
    component.getGradeError = getGradeError;
    component.getGradeInput = getGradeInput
    component.getIncorrect = getIncorrect;
    component.getName = getName;
    component.getResponsesBtn = getResponsesBtn;
    component.getScore = getScore;
    component.goBack = goBack;
    component.isCompleted = isCompleted;
    component.isEditGradePresent = isEditGradePresent;
    component.isPastDue = isPastDue;
    component.submitGrade = submitGrade;

    function getAttempts() {
        return component.attempts;
    }

    async function getAttemptsVisible() {
        return component.attempts.filter(async function(attempt) {
            return await attempt.isDisplayed();
        });
    }

    async function getCorrect(index) {
        return await component.attempts.get(index).element(by.css(component.correct)).getText();
    }

    function getDisplayedGrade(attempt) {
        return attempt.element(by.css(component.displayedGrade));
    }

    async function getEditGradeLink(index) {
        var gradeLink = component.attempts.get(index).element(by.css(component.editGradeLink));
        await component.browser.wait(EC.presenceOf(gradeLink), 10000);
        await component.browser.wait(EC.elementToBeClickable(gradeLink), 10000);
        return gradeLink;
    }

    function getGradeArea(index) {
        return component.attempts.get(index).element(by.css(component.gradeArea));
    }

    function getGradeError(index) {
        return component.attempts.get(index).element(by.css(component.gradeError));
    }

    function getGradeInput(index) {
        return component.attempts.get(index).element(by.css(component.gradeInput));
    }

    async function getIncorrect(index) {
        return await component.attempts.get(index).element(by.css(component.incorrect)).getText();
    }

    async function getName(index) {
        return await component.attempts.get(index).element(by.css(component.name)).getText();
    }

    function getResponsesBtn(index) {
        return component.attempts.get(index).element(by.css(component.responsesBtn));
    }

    async function getScore(index) {
        return await component.attempts.get(index).element(by.css(component.score)).getText();
    }

    async function goBack() {
        await component.backBtn.click();
    }

    async function isCompleted(index) {
        return await component.attempts.get(index).element(by.css(component.completed)).isPresent();
    }

    async function isEditGradePresent(index) {
        return await component.attempts.get(index).element(by.css(component.editGradeLink)).isPresent();
    }

    async function isPastDue(index) {
        return await component.attempts.get(index).element(by.css(component.pastDue)).isPresent();
    }

    async function submitGrade(index) {
        await component.attempts.get(index).element(by.partialButtonText(component.submitGradeBtn)).click();
    }
}

module.exports = AttemptsTableComponent;