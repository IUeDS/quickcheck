import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  @Input() currentQuestion;
  @Input() incorrectRows;
  @Output() onAnswerSelection = new EventEmitter();

  columns = [];
  rows = [];

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
