import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'qc-rich-content-toggle',
  templateUrl: './rich-content-toggle.component.html',
  styleUrls: ['./rich-content-toggle.component.scss']
})
export class RichContentToggleComponent implements OnInit {
  @Input() question;
  @Input() toggleType;
  @Output() onRichContentToggle = new EventEmitter();

  isToggled = false;

  constructor() { }

  ngOnInit() {
  }

}
