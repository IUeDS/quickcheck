import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-custom-activity-selection',
  templateUrl: './custom-activity-selection.component.html',
  styleUrls: ['./custom-activity-selection.component.scss']
})
export class CustomActivitySelectionComponent implements OnInit {

  customActivities = [];

  constructor() { }

  ngOnInit() {
  }

}
