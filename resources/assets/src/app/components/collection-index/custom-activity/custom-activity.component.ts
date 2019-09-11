import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-custom-activity',
  templateUrl: './custom-activity.component.html',
  styleUrls: ['./custom-activity.component.scss']
})
export class CustomActivityComponent implements OnInit {
  editingData = {}; //copy to separate object so if user cancels edit, data is intact
  isEditing = false;

  constructor() { }

  ngOnInit() {
  }

}
