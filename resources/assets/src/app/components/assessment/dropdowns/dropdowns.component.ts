import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-dropdowns',
  templateUrl: './dropdowns.component.html',
  styleUrls: ['./dropdowns.component.scss']
})
export class DropdownsComponent implements OnInit {
  @Input() currentQuestion;
  @Output() onAnswerSelection = new EventEmitter();

  prompts = [];
  selectableAnswers = [];

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
