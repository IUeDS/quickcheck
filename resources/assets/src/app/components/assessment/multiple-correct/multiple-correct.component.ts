import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-multiple-correct',
  templateUrl: './multiple-correct.component.html',
  styleUrls: ['./multiple-correct.component.scss']
})
export class MultipleCorrectComponent implements OnInit {
  @Input() currentQuestion;
  @Output() onAnswerSelection = new EventEmitter();

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
