import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-textmatch',
  templateUrl: './textmatch.component.html',
  styleUrls: ['./textmatch.component.scss']
})
export class TextmatchComponent implements OnInit {
  @Input() currentQuestion;
  @Output() onAnswerSelection = new EventEmitter();

  answer = null;

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
