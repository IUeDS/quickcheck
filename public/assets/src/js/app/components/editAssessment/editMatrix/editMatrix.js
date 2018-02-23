app.component('qcEditMatrix', {
    controller: EditMatrixController,
    controllerAs: 'vm',
    bindings: {
        onQuestionEdited: '&qcOnQuestionEdited',
        onSavedOptionDeleted: '&qcOnSavedOptionDeleted',
        question: '<qcQuestion',
        readOnly: '<qcReadOnly'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('editMatrixTemplate.html');
    }]
});

EditMatrixController.$inject = ['Utilities'];

function EditMatrixController(Utilities) {
    var vm = this;

    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.$onChanges = $onChanges;
    vm.addColumn = addColumn;
    vm.addRow = addRow;
    vm.deleteColumn = deleteColumn;
    vm.deleteRow = deleteRow;
    vm.initOptions = initOptions;
    vm.isInvalid = isInvalid;
    vm.onEdited = onEdited;
    vm.onSelect = onSelect;
    vm.onSubComponentEdited = onSubComponentEdited;

    function $onInit() {
        vm.initOptions();
        //when a new question is added, want to ensure validation is run immediately;
        //prevent a user from saving a new question without data added in.
        if (vm.isInvalid()) {
            vm.onEdited();
        }
    }

    function $onChanges(changesObj) {
        if (changesObj.question) {
            vm.question = changesObj.question.currentValue;
            vm.initOptions();
        }
    }

    function addColumn() {
        var tempId = (vm.question.columns.length + 1).toString() + '-temp';

        vm.question.columns.push({
            'id': tempId,
            'question_id': vm.question.id,
            'answer_text': '',
            'row_or_column': 'column'
        });

        vm.onEdited();
        vm.utils.focusToElement('#matrix-column-' + tempId);
    }

    function addRow() {
        var tempId = (vm.question.rows.length + 1).toString() + '-temp';

        vm.question.rows.push({
            'id': tempId,
            'question_id': vm.question.id,
            'answer_text': '',
            'row_or_column': 'row',
            'matrix_answer_text': '',
            'columnAnswerId': false
        });

        vm.onEdited();
        vm.utils.focusToElement('#matrix-row-' + tempId);
    }

    function deleteColumn($event) {
        var column = $event.option;

        //if the option was previously saved (not temp), add to deletedOptions array so we can delete on back-end
        if (column.id.toString().indexOf('temp') === -1) {
            vm.onSavedOptionDeleted({$event: { option: column }});
        }

        //remove as possible answer
        vm.question.rows.forEach(function(row) {
            if (row.columnAnswerId == column.id) {
                row.columnAnswerId = false;
            }
        });

        //remove the option entirely from the question options, so it does not muck up the view
        vm.question.columns.forEach(function(thisColumn, index) {
            if (thisColumn.id == column.id) {
                vm.question.columns.splice(index, 1);
            }
        });

        vm.onEdited();
    }

    function deleteRow($event) {
        var row = $event.option;

        //if the option was previously saved (not temp), add to deletedOptions array so we can delete on back-end
        if (row.id.toString().indexOf('temp') === -1) {
            vm.onSavedOptionDeleted({$event: { option: row }});
        }

        //remove the option entirely from the question options, so it does not muck up the view
        vm.question.rows.forEach(function(thisRow, index) {
            if (thisRow.id == row.id) {
                vm.question.rows.splice(index, 1);
            }
        });

        vm.onEdited();
    }

    function initOptions() {
        var rows = [],
            columns = [];

        //if brand new and nothing has been initialized yet
        if (!vm.question.columns && !vm.question.rows) {
            vm.question.columns = [];
            vm.question.rows = [];
        }

        //if already initialized (options gets whacked off after initialization)
        if (!vm.question.options) {
            return;
        }

        vm.question.options.forEach(function(qOption) {
            if (qOption.row_or_column == 'row') {
                rows.push(qOption);
            }
            else {
                columns.push(qOption);
            }
        });

        rows.forEach(function(row) {
            row.columnAnswerId = false;
            columns.forEach(function(column) {
                if (row.matrix_answer_text === column.answer_text) {
                    row.columnAnswerId = column.id;
                }
            });
        });

        vm.question.columns = columns;
        vm.question.rows = rows;

        //remove extraneous options array; this is handy for showing a quiz, but for
        //editing, easier to use arrays for columns/rows; since there are a lot of
        //variables in the options array, if there is a huge matrix question, the
        //server can throw an error if number of POST variables is too high
        delete vm.question.options;
    }

    function isInvalid() {
        var optionsAdded = false,
            missingAnswer = false;

        if (vm.question.rows.length && vm.question.columns.length) {
            optionsAdded = true;
        }

        //check that a correct answer is marked
        vm.question.rows.forEach(function(row) {
            if (!row.columnAnswerId) {
                missingAnswer = true;
            }
        });

        if (optionsAdded && !missingAnswer) {
            return false;
        }

        if (!optionsAdded) {
            return 'No answer options were added to this question.';
        }

        if (missingAnswer) {
            return 'A correct answer has not been marked.';
        }
    }

    function onEdited() {
        vm.question.validationError = vm.isInvalid();
        vm.onQuestionEdited({
            $event: {
                question: vm.question
            }
        });
    }

    //uncheck all boxes in the row except for the current one
    function onSelect(colId, row) {
        row.columnAnswerId = colId;

        vm.onEdited();
    }

    function onSubComponentEdited($event) {
        vm.question = $event.question;
        vm.onEdited();
    }
}