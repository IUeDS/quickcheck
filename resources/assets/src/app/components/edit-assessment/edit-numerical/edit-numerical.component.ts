import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-numerical',
  templateUrl: './edit-numerical.component.html',
  styleUrls: ['./edit-numerical.component.scss']
})
export class EditNumericalComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
