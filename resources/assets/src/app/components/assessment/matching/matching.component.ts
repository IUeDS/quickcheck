import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements OnInit {
  @Input() currentQuestion;
  @Input() incorrectRows;
  @Output() onAnswerSelection = new EventEmitter();

  prompts = [];
  selectableAnswers = [];

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

  ngOnChanges(changesObj)  {
    if (changesObj.currentQuestion) {
      this.initOptions();
      this.utilitiesService.formatMath();
      this.utilitiesService.setLtiHeight();
    }
  }

  checkRowCorrectness(prompt) {
    if (!this.incorrectRows) {
      return true;
    }

    var correct = true;

    for (let incorrectRow of this.incorrectRows) {
      if (prompt.id == incorrectRow.id) {
        correct = false;
      }
    }

    return correct;
  }

  getCurrentAnswers() {
    var answers = [];

    for (let prompt of this.prompts) {
      if (prompt.selected_answer) {
        var answer = {'prompt_id': prompt.id, 'answer_id': prompt.selected_answer};
        answers.push(answer);
      }
    }

    return answers;
  }

  initOptions() {
    //reset if necessary (if multiple questions of same type)
    this.prompts = [];
    this.selectableAnswers = [];

    for (let qOption of this.currentQuestion.options) {
      if (qOption.prompt_or_answer == 'prompt') {
        qOption.selected_answer = null; //reset if student is restarting QC
        this.prompts.push(qOption);
      }
      else {
        qOption.prompt_id = false; //reset if student is restarting QC
        this.selectableAnswers.push(qOption);
      }
    }
  }

  isAnswerUsed(selectableAnswer) {
    if (selectableAnswer.prompt_id) {
      return true;
    }

    return false;
  }

  onAnswerSelected(prompt) {
    var studentAnswer = {'matching_answers': []},
      answerComplete = false;

    this.updateAnswers(prompt);
    studentAnswer.matching_answers = this.getCurrentAnswers();

    if (studentAnswer.matching_answers.length === this.prompts.length) {
      answerComplete = true;
    }

    this.onAnswerSelection.emit({
      answerComplete: answerComplete,
      studentAnswer: studentAnswer
    });
  }

  updateAnswers(prompt) {
    for (let selectableAnswer of this.selectableAnswers) {
      if (selectableAnswer.id == prompt.selected_answer) {
        //set current option as answered
        selectableAnswer.prompt_id = prompt.id;
      }
      else if (selectableAnswer.prompt_id == prompt.id) {
        //if a previously selected option with this prompt, no longer answered
        selectableAnswer.prompt_id = false;
      }
    }
  }
}
