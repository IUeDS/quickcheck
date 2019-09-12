import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements OnInit {
  @Input() currentQuestion;
  @Input() incorrectRows;
  @Output() onAnswerSelection = new EventEmitter();

  prompts = [];
  selectableAnswers = [];

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
