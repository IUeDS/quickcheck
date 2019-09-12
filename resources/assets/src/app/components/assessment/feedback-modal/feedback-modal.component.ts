import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'qc-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class FeedbackModalComponent implements OnInit {
  @Input() feedback;
  @Input() isCorrect;
  @Input() isNextBtnDisabled;
  @Output() onNextQuestion = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
