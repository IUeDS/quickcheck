app.component('qcMatrix', {
    controller: MatrixController,
    controllerAs: 'vm',
    bindings: {
        currentQuestion: '<qcCurrentQuestion',
        incorrectRows: '<qcIncorrectRows',
        onAnswerSelection: '&qcOnAnswerSelection'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('matrixTemplate.html');
    }]
});

MatrixController.$inject = ['Utilities'];

function MatrixController(Utilities) {
    var vm = this;

    vm.columns = [];
    vm.rows = [];
    vm.utils = new Utilities();

    vm.$onChanges = $onChanges;
    vm.checkRowCorrectness = checkRowCorrectness;
    vm.getCurrentAnswers = getCurrentAnswers;
    vm.initOptions = initOptions;
    vm.onAnswerSelected = onAnswerSelected;
    vm.updateRow = updateRow;

    //use $onChanges instead of $onInit, in case component is used
    //multiple times for repeated questions of the same type
    //(necessary here because column/row data specific to component logic)
    function $onChanges(changesObj) {
        if (changesObj.currentQuestion) {
            vm.initOptions();
            vm.utils.formatMath();
            vm.utils.setLtiHeight();
        }
    }

    //for matrix feedback, mark the correct/incorrect rows
    function checkRowCorrectness(row) {
        if (!vm.incorrectRows) {
            return true;
        }

        var correct = true;

        vm.incorrectRows.forEach(function(incorrectRow) {
            if (row.id == incorrectRow.id) {
                correct = false;
            }
        });

        return correct;
    }

    function getCurrentAnswers() {
        var answers = [];

        vm.rows.forEach(function(row) {
            row.columns.forEach(function(column) {
                if (column.selected) {
                    var answer = {'row_id': row.id, 'column_id': column.id};
                    answers.push(answer);
                }
            });
        });

        return answers;
    }

    function initOptions() {
        //reset, if necessary (i.e., repeated question type)
        vm.columns = [];
        vm.rows = [];

        //
        vm.currentQuestion.options.forEach(function(qOption) {
            if (qOption.row_or_column == 'row') {
                vm.rows.push(qOption);
            }
            else {
                vm.columns.push(qOption);
            }
        });

        //nest columns within each row for easy selection; also ensures that
        //if column selection is shuffled, this follows the same order
        //use angular.copy() for deep cloning
        vm.rows.forEach(function(row) {
            angular.copy(vm.columns, row.columns);
        });
    }

    function onAnswerSelected(row, column) {
        var studentAnswer = {'matrix_answers': []},
            answerComplete = false;

        vm.updateRow(row, column); //make sure single checkbox selected per row
        studentAnswer.matrix_answers = vm.getCurrentAnswers();

        if (studentAnswer.matrix_answers.length === vm.rows.length) {
            answerComplete = true;
        }

        vm.onAnswerSelection({
            $event: {
                answerComplete: answerComplete,
                studentAnswer: studentAnswer
            }
        });
    }

    //uncheck all boxes in the row except for the current one
    function updateRow(row, selectedColumn) {
        row.columns.forEach(function(column) {
            if (column.id == selectedColumn.id) {
                column.selected = true;
            }
            else {
                column.selected = false;
            }
        });
    }
}