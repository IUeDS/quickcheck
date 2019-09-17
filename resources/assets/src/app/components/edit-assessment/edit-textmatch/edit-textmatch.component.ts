import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-textmatch',
  templateUrl: './edit-textmatch.component.html',
  styleUrls: ['./edit-textmatch.component.scss']
})
export class EditTextmatchComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    //when a new question is added, want to ensure validation is run immediately;
    //prevent a user from saving a new question without data added in.
    if (this.isInvalid()) {
      this.onEdited();
    }
  }

  addOption() {
    const tempId = (this.question.options.length + 1).toString() + '-temp';

    this.question.options.push({
      'id': tempId,
      'question_id': this.question.id,
      'textmatch_answer_text': ''
    });

    this.onEdited();
    this.utilitiesService.focusToElement('#textmatch-answer-' + this.question.id + '-' + tempId);
  }

  deleteOption($event) {
    var option = $event.option,
      index = $event.index;

    //parent question component keeps track of all deleted options to pass to back-end
    if (option.id.toString().indexOf('temp') === -1) {
      this.onSavedOptionDeleted.emit({ option });
    }

    this.question.options.splice(index, 1);
    this.onEdited();
  }

  isInvalid() {
    if (this.question.options.length) {
      return false;
    }
    else {
      return 'No answer options were added to this question.';
    }
  }

  onEdited() {
    this.question.validationError = this.isInvalid();
    this.onQuestionEdited.emit({ question: this.question });
  }

  onSubComponentEdited($event) {
    this.question = $event.question;
    this.onEdited();
  }
}
