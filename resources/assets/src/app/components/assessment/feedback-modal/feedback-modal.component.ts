import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'qc-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class FeedbackModalComponent implements OnInit {
  @Input() feedback;
  @Input() isCorrect;
  @Input() isNextBtnDisabled;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  nextQuestion() {
    this.bsModalRef.hide();
  }
}
