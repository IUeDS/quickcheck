import { Component, OnInit } from '@angular/core';
import { CustomActivityService } from '../../../services/custom-activity.service';

@Component({
  selector: 'qc-custom-activity',
  templateUrl: './custom-activity.component.html',
  styleUrls: ['./custom-activity.component.scss']
})
export class CustomActivityComponent implements OnInit {
  editingData = {}; //copy to separate object so if user cancels edit, data is intact
  isEditing = false;

  constructor(private customActivityService: CustomActivityService) { }

  ngOnInit() {
  }

}
