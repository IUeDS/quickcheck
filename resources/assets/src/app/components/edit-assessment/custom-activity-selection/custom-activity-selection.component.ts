import { Component, OnInit, Input } from '@angular/core';
import { CustomActivityService } from '../../../services/custom-activity.service';

@Component({
  selector: 'qc-custom-activity-selection',
  templateUrl: './custom-activity-selection.component.html',
  styleUrls: ['./custom-activity-selection.component.scss']
})
export class CustomActivitySelectionComponent implements OnInit {
  @Input() admin;
  @Input() assessment;
  @Input() customActivity;
  @Input() customActivityAdded;
  @Input() readOnly;
  @Input() utilitiesService;

  customActivities = [];

  constructor(private customActivityService: CustomActivityService) { }

  ngOnInit() {
  }

}
