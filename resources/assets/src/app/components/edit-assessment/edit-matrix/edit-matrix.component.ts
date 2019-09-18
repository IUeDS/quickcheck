import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-matrix',
  templateUrl: './edit-matrix.component.html',
  styleUrls: ['./edit-matrix.component.scss']
})
export class EditMatrixComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

  ngOnChanges(changesObj) {
    if (changesObj.question) {
      this.question = changesObj.question.currentValue;
      this.initOptions();
    }
  }

  addColumn() {
    var tempId = (this.question.columns.length + 1).toString() + '-temp';

    this.question.columns.push({
      'id': tempId,
      'question_id': this.question.id,
      'answer_text': '',
      'row_or_column': 'column'
    });

    this.onEdited();
    this.utilitiesService.focusToElement('#matrix-column-' + tempId);
  }

  addRow() {
    var tempId = (this.question.rows.length + 1).toString() + '-temp';

    this.question.rows.push({
      'id': tempId,
      'question_id': this.question.id,
      'answer_text': '',
      'row_or_column': 'row',
      'matrix_answer_text': '',
      'columnAnswerId': false
    });

    this.onEdited();
    this.utilitiesService.focusToElement('#matrix-row-' + tempId);
  }

  deleteColumn($event) {
    var column = $event.option;

    //if the option was previously saved (not temp), add to deletedOptions array so we can delete on back-end
    if (column.id.toString().indexOf('temp') === -1) {
      this.onSavedOptionDeleted.emit({ option: column });
    }

    //remove as possible answer
    for (let row of this.question.rows) {
      if (row.columnAnswerId == column.id) {
        row.columnAnswerId = false;
      }
    }

    //remove the option entirely from the question options, so it does not muck up the view
    for (let [index, thisColumn] of this.question.columns.entries()) {
      if (thisColumn.id == column.id) {
        this.question.columns.splice(index, 1);
      }
    }

    this.onEdited();
  }

  deleteRow($event) {
    var row = $event.option;

    //if the option was previously saved (not temp), add to deletedOptions array so we can delete on back-end
    if (row.id.toString().indexOf('temp') === -1) {
      this.onSavedOptionDeleted.emit({ option: row });
    }

    //remove the option entirely from the question options, so it does not muck up the view
    for (let [index, thisRow] of this.question.rows.entries()) {
      if (thisRow.id == row.id) {
        this.question.rows.splice(index, 1);
      }
    }

    this.onEdited();
  }

  initOptions() {
    var rows = [],
      columns = [];

    //if brand new and nothing has been initialized yet
    if (!this.question.columns && !this.question.rows) {
      this.question.columns = [];
      this.question.rows = [];
    }

    //if already initialized (options gets whacked off after initialization)
    if (!this.question.options) {
      return;
    }

    for (let qOption of this.question.options) {
      if (qOption.row_or_column == 'row') {
        rows.push(qOption);
      }
      else {
        columns.push(qOption);
      }
    }

    for (let row of rows) {
      row.columnAnswerId = false;
      for (let column of columns) {
        if (row.matrix_answer_text === column.answer_text) {
          row.columnAnswerId = column.id;
        }
      }
    }

    this.question.columns = columns;
    this.question.rows = rows;

    //remove extraneous options array; this is handy for showing a quiz, but for
    //editing, easier to use arrays for columns/rows; since there are a lot of
    //variables in the options array, if there is a huge matrix question, the
    //server can throw an error if number of POST variables is too high
    delete this.question.options;
  }

  isInvalid() {
    var optionsAdded = false,
      missingAnswer = false;

    if (this.question.rows.length && this.question.columns.length) {
      optionsAdded = true;
    }

    //check that a correct answer is marked
    for (let row of this.question.rows) {
      if (!row.columnAnswerId) {
        missingAnswer = true;
      }
    }

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

  onEdited() {
    this.question.validationError = this.isInvalid();
    this.onQuestionEdited.emit({ question: this.question });
  }

  //uncheck all boxes in the row except for the current one
  onSelect(colId, row) {
    row.columnAnswerId = colId;

    this.onEdited();
  }

  onSubComponentEdited($event) {
    this.question = $event.question;
    this.onEdited();
  }

}
