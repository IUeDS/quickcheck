import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'qc-delete-option-btn',
  templateUrl: './delete-option-btn.component.html',
  styleUrls: ['./delete-option-btn.component.scss']
})
export class DeleteOptionBtnComponent implements OnInit {
  @Input() index;
  @Input() option;
  @Input() optionTypeText;
  @Input() question;
  @Output() onDelete = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  deleteOption() {
    this.onDelete.emit({
      'option': this.option,
      'index': this.index
    });
  }

}
