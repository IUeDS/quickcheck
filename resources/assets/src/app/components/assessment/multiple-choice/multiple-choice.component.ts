import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit {
  @Input() currentQuestion;
  @Input() modalVisible;
  @Output() onAnswerSelection = new EventEmitter();

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

  ngOnChanges(changesObj) {
    if (changesObj.currentQuestion) {
      this.utilitiesService.formatMath();
      //reset options for new question data (esp. after a restart)
      for (let answerOption of this.currentQuestion.options) {
        answerOption.selected = false;
      }
    }

    this.utilitiesService.setLtiHeight();
  }

  onAnswerSelected(option) {
    option.selected = !option.selected;

    //pretty straight-forward with multiple choice--if any option selected,
    //then fire up to parent component that answer is complete
    this.onAnswerSelection.emit({
      answerComplete: true,
      studentAnswer: {'mc_answer_id': option.id}
    });
  }

}
