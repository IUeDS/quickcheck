import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'qc-randomize-checkbox',
  templateUrl: './randomize-checkbox.component.html',
  styleUrls: ['./randomize-checkbox.component.scss']
})
export class RandomizeCheckboxComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  isRandomized() {
    if (this.question.randomized == 1) {
      return true;
    }

    return false;
  }

  onEdited() {
    this.onQuestionEdited.emit({question: this.question});
  }

  toggleRandomized() {
    if (this.question.randomized == 1) {
      this.question.randomized = 0;
    }
    else {
      this.question.randomized = 1;
    }

    this.onEdited();
  }

}
