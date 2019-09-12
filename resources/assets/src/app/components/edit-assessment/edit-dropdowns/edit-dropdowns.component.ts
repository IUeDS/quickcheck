import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'qc-edit-dropdowns',
  templateUrl: './edit-dropdowns.component.html',
  styleUrls: ['./edit-dropdowns.component.scss']
})
export class EditDropdownsComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
