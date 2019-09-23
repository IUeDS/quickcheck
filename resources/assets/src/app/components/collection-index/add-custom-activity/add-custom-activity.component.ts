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

  customActivityData;
  isOpen = false;

  constructor(private customActivityService: CustomActivityService) { }

  ngOnInit() {
  }

  closeForm() {
    this.isOpen = false;
    this.customActivityData = {}; //reset
  }

  openForm() {
    this.isOpen = true;
  }

  async save() {
    this.utilitiesService.loadingStarted();
    let data;

    try {
      const resp = await this.customActivityService.createCustom(this.customActivityData);
      data = this.utilitiesService.getResponseData(resp);
    }
    catch (error) {
      this.utilitiesService.showError(error);
      return;
    }

    const customActivity = data.customActivity;
    this.utilitiesService.loadingFinished();
    this.closeForm();
    //notify parent to add to list
    this.onSave.emit({ customActivity });
  }

}
