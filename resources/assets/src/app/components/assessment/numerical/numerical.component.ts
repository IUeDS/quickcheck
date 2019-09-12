import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-numerical',
  templateUrl: './numerical.component.html',
  styleUrls: ['./numerical.component.scss']
})
export class NumericalComponent implements OnInit {
  @Input() currentQuestion;
  @Output() onAnswerSelection = new EventEmitter();

  answer = null;

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
