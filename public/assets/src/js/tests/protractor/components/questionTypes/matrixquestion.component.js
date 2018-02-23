var MatrixQuestionComponent = function(browserRef, question) {
    var component = this;
    component.browser = browserRef;
    component.question = question;

    //elements
    component.matrixAddColumnBtn = component.question.element(by.partialButtonText('Add column'));
    component.matrixAddRowBtn = component.question.element(by.partialButtonText('Add row'));
    component.matrixCheckboxes = component.question.all(by.css('table input[type="checkbox"]'));
    component.matrixColumns = component.question.all(by.repeater('column in vm.question.columns'));
    component.matrixRows = component.question.all(by.repeater('row in vm.question.rows'));
    component.matrixTextInputs = component.question.all(by.css('table input[type="text"]'));

    //strings for sub-elements

    //functions
    component.addMatrixColumn = addMatrixColumn;
    component.addMatrixRow = addMatrixRow;
    component.getMatrixCheckboxes = getMatrixCheckboxes;
    component.getMatrixColumns = getMatrixColumns;
    component.getMatrixRows = getMatrixRows;
    component.getMatrixTextInputs = getMatrixTextInputs;

    function addMatrixColumn() {
        component.matrixAddColumnBtn.click();
    }

    function addMatrixRow() {
        component.matrixAddRowBtn.click();
    }

    function getMatrixCheckboxes() {
        return component.matrixCheckboxes;
    }

    function getMatrixColumns() {
        return component.matrixColumns;
    }

    function getMatrixRows() {
        return component.matrixRows;
    }

    function getMatrixTextInputs() {
        return component.matrixTextInputs;
    }
}

module.exports = MatrixQuestionComponent;