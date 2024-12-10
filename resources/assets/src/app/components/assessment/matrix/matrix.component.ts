import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'qc-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  @Input() currentQuestion;
  @Input() incorrectRows;
  @Output() onAnswerSelection = new EventEmitter();

  columns = [];
  rows = [];

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

  ngOnChanges(changesObj) {
    if (changesObj.currentQuestion) {
      this.initOptions();
      this.utilitiesService.formatMath();
      this.utilitiesService.setLtiHeight();
    }
  }

  //for matrix feedback, mark the correct/incorrect rows
  checkRowCorrectness(row) {
    if (!this.incorrectRows) {
      return true;
    }

    var correct = true;

    for (let incorrectRow of this.incorrectRows) {
      if (row.id == incorrectRow.id) {
        correct = false;
      }
    }

    return correct;
  }

  getCurrentAnswers() {
    var answers = [];

    for (let row of this.rows) {
      for (let column of row.columns) {
        if (column.selected) {
          var answer = {'row_id': row.id, 'column_id': column.id};
          answers.push(answer);
        }
      }
    }

    return answers;
  }

  initOptions() {
    //reset, if necessary (i.e., repeated question type)
    this.columns = [];
    this.rows = [];

    for (let qOption of this.currentQuestion.options) {
      if (qOption.row_or_column == 'row') {
        this.rows.push(qOption);
      }
      else {
        this.columns.push(qOption);
      }
    }

    //nest columns within each row for easy selection; also ensures that
    //if column selection is shuffled, this follows the same order
    for (let row of this.rows) {
      row.columns = cloneDeep(this.columns);
    }
  }

  onAnswerSelected(row, column) {
    var studentAnswer = {'matrix_answers': []},
      answerComplete = false;

    this.updateRow(row, column); //make sure single checkbox selected per row
    studentAnswer.matrix_answers = this.getCurrentAnswers();

    if (studentAnswer.matrix_answers.length === this.rows.length) {
      answerComplete = true;
    }

    this.onAnswerSelection.emit({
      answerComplete: answerComplete,
      studentAnswer: studentAnswer
    });
  }

  //uncheck all boxes in the row except for the current one
  updateRow(row, selectedColumn) {
    for (let column of row.columns) {
      if (column.id == selectedColumn.id) {
        column.selected = true;
      }
      else {
        column.selected = false;
      }
    }
  }
}
