import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-textmatch',
  templateUrl: './edit-textmatch.component.html',
  styleUrls: ['./edit-textmatch.component.scss']
})
export class EditTextmatchComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
