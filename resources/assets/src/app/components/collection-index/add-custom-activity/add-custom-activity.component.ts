import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomActivityService } from '../../../services/custom-activity.service';

@Component({
  selector: 'qc-add-custom-activity',
  templateUrl: './add-custom-activity.component.html',
  styleUrls: ['./add-custom-activity.component.scss']
})
export class AddCustomActivityComponent implements OnInit {
  @Input() utilitiesService;
  @Output() onSave = new EventEmitter();

  customActivityData = {};
  isOpen = false;

  constructor(private customActivityService: CustomActivityService) { }

  ngOnInit() {
  }

}
