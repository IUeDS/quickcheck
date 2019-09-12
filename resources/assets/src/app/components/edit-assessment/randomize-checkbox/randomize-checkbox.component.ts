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

}
