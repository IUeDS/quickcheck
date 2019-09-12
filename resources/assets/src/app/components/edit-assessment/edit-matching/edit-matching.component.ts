import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-matching',
  templateUrl: './edit-matching.component.html',
  styleUrls: ['./edit-matching.component.scss']
})
export class EditMatchingComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
