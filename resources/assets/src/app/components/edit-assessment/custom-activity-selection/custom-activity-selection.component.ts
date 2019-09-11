import { Component, OnInit } from '@angular/core';
import { CustomActivityService } from '../../../services/custom-activity.service';

@Component({
  selector: 'qc-custom-activity-selection',
  templateUrl: './custom-activity-selection.component.html',
  styleUrls: ['./custom-activity-selection.component.scss']
})
export class CustomActivitySelectionComponent implements OnInit {

  customActivities = [];

  constructor(private customActivityService: CustomActivityService) { }

  ngOnInit() {
  }

}
