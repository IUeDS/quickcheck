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
    if (this.question.randomized) {
      return true;
    }

    return false;
  }

  onEdited() {
    this.onQuestionEdited.emit({question: this.question});
  }

  toggleRandomized() {
    if (this.question.randomized) {
      this.question.randomized = false;
    }
    else {
      this.question.randomized = true;
    }

    this.onEdited();
  }

}
