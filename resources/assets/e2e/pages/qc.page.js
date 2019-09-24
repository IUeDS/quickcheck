var QcPage = function(browserRef) {
    var page = this,
        EC = protractor.ExpectedConditions;
    page.browser = browserRef;
    page.maxWait = 10000;

    //elements
    page.continueBtn = page.browser.element(by.css('.qc-continue-btn'));
    page.description = page.browser.element(by.css('.qc-assessment-description'));
    page.dropdownPrompts = page.browser.element.all(by.css('label'));
    page.finalScore = page.browser.element(by.css('.qc-final-score'));
    page.finishedMessage = page.browser.element(by.css('.qc-finished-msg'));
    page.finishedGradedMessage = page.browser.element(by.css('.qc-graded-msg'));
    page.finishedGradePendingMessage = page.browser.element(by.css('.qc-grade-pending-msg'));
    page.finishedUngradedMessage = page.browser.element(by.css('.qc-ungraded-msg'));
    page.incorrectRows = page.browser.element.all(by.css('tr.danger'));
    page.matchingPrompts = page.browser.element.all(by.css('table tr td:first-of-type'));
    page.mcOptions = page.browser.element.all(by.css('.qc-assessment-multiple-choice-option'));
    page.matrixCheckboxes = page.browser.element.all(by.css('table input'));
    page.matrixColumnCells = page.browser.element.all(by.css('table th'));
    page.matrixRowCells = page.browser.element.all(by.css('table tr td:first-of-type'));
    page.modalCompletion = page.browser.element(by.css('#qc-completion-modal'));
    page.modalFade = page.browser.element(by.css('.modal-backdrop.fade'));
    page.modalFeedback = page.browser.element(by.css('#qc-feedback-modal'));
    page.modalFeedbackHeader = page.modalFeedback.element(by.css('h2'));
    page.moduleMessage = page.browser.element(by.css('.qc-module-msg'));
    page.numericalInput = page.browser.element(by.css('input[type="number"]'));
    page.perResponseFeedback = page.browser.element.all(by.css('.custom-feedback'));
    page.questionProgress = page.browser.element(by.css('.qc-question-number'));
    page.questionText = page.browser.element(by.css('.qc-assessment-question'));
    page.restartBtn = page.browser.element(by.css('.qc-btn-restart-assessment'));
    page.rowFeedback = page.browser.element(by.css('.qc-row-feedback'));
    page.rowFeedbackContinueBtn = page.rowFeedback.element(by.partialButtonText('Click to continue'));
    page.selectables = page.browser.element.all(by.css('.qc-selectable-answer-option'));
    page.selects = page.browser.element.all(by.css('select')); //keeping this generic for both matching/dropdowns
    page.score = page.browser.element(by.css('.qc-current-score'));
    page.startOverBtn = page.browser.element(by.css('.qc-restart'));
    page.submitBtn = page.browser.element(by.css('.qc-submit-response'));
    page.textmatchInput = page.browser.element(by.css('input[type="text"]'));
    page.timeoutModal = page.browser.element(by.css('#qc-assessment-timeout-modal'));
    page.timeoutRestartBtn = page.browser.element(by.css('#qc-assessment-timeout-modal .qc-btn-restart-assessment'));
    page.timeoutTimer = page.browser.element(by.css('.qc-timeout-timer'));
    page.title = page.browser.element(by.css('.qc-assessment-title'));

    //substring selectors
    page.correctHeader = 'Correct';
    page.incorrectHeader = 'Incorrect';
    page.mcInput = 'input';
    page.selectablePicked = 'label-default';

    //functions
    page.clickContinue = clickContinue;
    page.clickRowContinue = clickRowContinue;
    page.enterNumericalAnswer = enterNumericalAnswer;
    page.enterTextmatchAnswer = enterTextmatchAnswer;
    page.getDescription = getDescription;
    page.getDropdownPrompts = getDropdownPrompts;
    page.getFinalScore = getFinalScore;
    page.getIncorrectRows = getIncorrectRows;
    page.getMatchingPrompts = getMatchingPrompts;
    page.getMatrixCheckboxes = getMatrixCheckboxes;
    page.getMatrixColumnCells = getMatrixColumnCells;
    page.getMatrixRowCells = getMatrixRowCells;
    page.getMcOptions = getMcOptions;
    page.getNumericalInput = getNumericalInput;
    page.getPerResponseFeedback = getPerResponseFeedback;
    page.getQuestionProgress = getQuestionProgress;
    page.getQuestionText = getQuestionText;
    page.getRowFeedback = getRowFeedback;
    page.getSelectables = getSelectables;
    page.getSelects = getSelects;
    page.getScore = getScore;
    page.getTextmatchInput = getTextmatchInput;
    page.getTimeoutModal = getTimeoutModal;
    page.getTimeoutRestartBtn = getTimeoutRestartBtn;
    page.getTimeoutTimer = getTimeoutTimer;
    page.getTitle = getTitle;
    page.isCompletionModalVisible = isCompletionModalVisible;
    page.isCorrectModal = isCorrectModal;
    page.isIncorrectModal = isIncorrectModal;
    page.isCorrectRowFeedback = isCorrectRowFeedback;
    page.isIncorrectRowFeedback = isIncorrectRowFeedback;
    page.isModuleMessagePresent = isModuleMessagePresent;
    page.isQcFinished = isQcFinished;
    page.isQcGraded = isQcGraded;
    page.isQcPendingGrade = isQcPendingGrade;
    page.isQcUngraded = isQcUngraded;
    page.isSelectablePicked = isSelectablePicked;
    page.isSubmitBtnDisabled = isSubmitBtnDisabled;
    page.restart = restart;
    page.selectIncorrectRandomMcOption = selectIncorrectRandomMcOption;
    page.selectMatrixCheckboxByIndex = selectMatrixCheckboxByIndex;
    page.selectMcOptionByIndex = selectMcOptionByIndex;
    page.selectOption = selectOption;
    page.startOver = startOver;
    page.submit = submit;
    page.waitForModalClose = waitForModalClose;

    async function clickContinue() {
        await page.browser.wait(EC.visibilityOf(page.continueBtn), page.maxWait);
        await page.continueBtn.click();
    }

    async function clickRowContinue() {
        await page.rowFeedbackContinueBtn.click();
    }

    async function enterNumericalAnswer(answer) {
        var input = page.getNumericalInput();
        await page.waitForModalClose(input);
        await input.sendKeys(answer);
    }

    async function enterTextmatchAnswer(answer) {
        var input = page.getTextmatchInput();
        await page.waitForModalClose(input);
        await input.sendKeys(answer);
    }

    function getDescription() {
        return page.description;
    }

    function getDropdownPrompts() {
        return page.dropdownPrompts;
    }

    async function getFinalScore() {
        const text = await page.finalScore.getText();
        return text.toLowerCase();
    }

    function getIncorrectRows() {
        return page.incorrectRows;
    }

    function getMatchingPrompts() {
        return page.matchingPrompts;
    }

    function getMatrixCheckboxes() {
        return page.matrixCheckboxes;
    }

    function getMatrixColumnCells() {
        return page.matrixColumnCells;
    }

    function getMatrixRowCells() {
        return page.matrixRowCells;
    }

    function getMcOptions() {
        return page.mcOptions;
    }

    function getNumericalInput() {
        return page.numericalInput;
    }

    function getPerResponseFeedback() {
        return page.perResponseFeedback;
    }

    async function getQuestionProgress() {
        const text = await page.questionProgress.getText();
        return text.toLowerCase();
    }

    async function getQuestionText() {
        return await page.questionText.getText();
    }

    function getRowFeedback() {
        return page.rowFeedback;
    }

    function getSelectables() {
        return page.selectables;
    }

    function getSelects() {
        return page.selects;
    }

    async function getScore() {
        const text = await page.score.getText();
        return text.toLowerCase();
    }

    function getTextmatchInput() {
        return page.textmatchInput;
    }

    function getTimeoutModal() {
        return page.timeoutModal;
    }

    function getTimeoutRestartBtn() {
        return page.timeoutRestartBtn;
    }

    function getTimeoutTimer() {
        return page.timeoutTimer;
    }

    function getTitle() {
        return page.title;
    }

    async function isCompletionModalVisible() {
        await page.browser.wait(EC.visibilityOf(page.modalCompletion));
        return true;
    }

    async function isCorrectModal() {
        await page.browser.wait(EC.visibilityOf(page.modalFeedback));
        const text = await page.modalFeedbackHeader.getText();

        if (text.indexOf(page.correctHeader) > -1) {
            return true;
        }

        return false;
    }

    async function isIncorrectModal() {
        await page.browser.wait(EC.visibilityOf(page.modalFeedback));
        const text = await page.modalFeedbackHeader.getText();

        if (text.indexOf(page.incorrectHeader) > -1) {
            return true;
        }

        return false;
    }

    async function isCorrectRowFeedback() {
        var feedback = page.getRowFeedback();
        const text = await feedback.getText();

        if (text.indexOf(page.correctHeader.toUpperCase()) > -1) {
            return true;
        }

        return false;
    }

    async function isIncorrectRowFeedback() {
        var feedback = page.getRowFeedback();
        const text = await feedback.getText();

        if (text.indexOf(page.incorrectHeader.toUpperCase()) > -1) {
            return true;
        }

        return false;
    }

    async function isModuleMessagePresent() {
        return await page.moduleMessage.isPresent();
    }

    async function isQcFinished() {
        await page.browser.wait(EC.visibilityOf(page.finishedMessage), page.maxWait);
        return await page.finishedMessage.isDisplayed();
    }

    async function isQcGraded() {
        await page.browser.wait(EC.visibilityOf(page.modalCompletion));
        return await page.finishedGradedMessage.isDisplayed();
    }

    async function isQcPendingGrade() {
        await page.browser.wait(EC.visibilityOf(page.modalCompletion));
        return await page.finishedGradePendingMessage.isDisplayed();
    }

    async function isQcUngraded() {
        await page.browser.wait(EC.visibilityOf(page.modalCompletion));
        return await page.finishedUngradedMessage.isDisplayed();
    }

    async function isSelectablePicked(index) {
        var selectable = page.getSelectables().get(index);
        const classString = await selectable.getAttribute('class');

        if (classString.indexOf(page.selectablePicked) > -1) {
            return true;
        }

        return false;
    }

    async function isSubmitBtnDisabled() {
        const attr = await page.submitBtn.getAttribute('disabled');

        if (attr == 'true') {
            return true;
        }

        return false;
    }

    async function restart() {
        await page.browser.wait(EC.visibilityOf(page.modalCompletion));
        await page.browser.sleep(1000); //make sure modal animation is fully complete
        await page.restartBtn.click();
        await page.browser.sleep(1000);
    }

    async function selectIncorrectRandomMcOption(correctOption) {
        var answerSelected = false;
        page.getMcOptions().each(async function(option) {
            const text = await option.getText();
            if (text !== correctOption && !answerSelected) {
                await option.element(by.css(page.mcInput)).click();
                answerSelected = true; //can't break out of .each() loop
            }
        });
    }

    async function selectMatrixCheckboxByIndex(index) {
        var checkboxes = page.getMatrixCheckboxes(),
            option = checkboxes.get(index);
        await page.waitForModalClose(option);
        await option.click();
    }

    async function selectMcOptionByIndex(index) {
        var option = page.mcOptions.get(index).element(by.css(page.mcInput));
        await page.waitForModalClose(option);
        await option.click();
    }

    async function selectOption(selectIndex, text) {
        var select = page.getSelects().get(selectIndex);
        await page.waitForModalClose(select);
        await select.sendKeys(text);
    }

    async function startOver() {
        await page.startOverBtn.click();
        await page.browser.sleep(1000);
    }

    async function submit() {
        await page.browser.wait(EC.elementToBeClickable(page.submitBtn));
        await page.submitBtn.click();
    }

    //keep an eye on this github issue for a possible better solution for this in
    //the future: https://github.com/angular/protractor/issues/2313
    async function waitForModalClose(nextElement) {
        var clickable = EC.elementToBeClickable(nextElement),
            invisible = EC.invisibilityOf(page.modalFade);
        await page.browser.wait(EC.and(clickable, invisible), page.maxWait);
    }
}

module.exports = QcPage;