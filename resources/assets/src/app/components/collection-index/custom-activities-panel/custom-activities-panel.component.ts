import { Component, OnInit } from '@angular/core';
import { CustomActivityService } from '../../../services/custom-activity.service';

@Component({
  selector: 'qc-custom-activities-panel',
  templateUrl: './custom-activities-panel.component.html',
  styleUrls: ['./custom-activities-panel.component.scss']
})
export class CustomActivitiesPanelComponent implements OnInit {
  customActivities = [];
  isOpen = false;
  loading = false;

  constructor(private customActivityService: CustomActivityService) { }

  ngOnInit() {
  }

}
