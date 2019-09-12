import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-matrix',
  templateUrl: './edit-matrix.component.html',
  styleUrls: ['./edit-matrix.component.scss']
})
export class EditMatrixComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited;
  @Output() onSavedOptionDeleted;

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
