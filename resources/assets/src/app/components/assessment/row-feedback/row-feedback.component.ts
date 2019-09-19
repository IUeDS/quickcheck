import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-row-feedback',
  templateUrl: './row-feedback.component.html',
  styleUrls: ['./row-feedback.component.scss']
})
export class RowFeedbackComponent implements OnInit {
  @Input() feedback;
  @Input() incorrectRows;
  @Input() isCorrect;
  @Input() isNextBtnDisabled;
  @Input() partialCredit;
  @Output() onContinue = new EventEmitter();

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.utilitiesService.formatMath(); //if equations shown in feedback
  }

  next() {
    this.onContinue.emit();
  }
}
