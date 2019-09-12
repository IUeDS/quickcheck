import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit {
  @Input() currentQuestion;
  @Output() onAnswerSelection = new EventEmitter();

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
