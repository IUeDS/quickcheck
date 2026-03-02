import { Component, OnInit, Input } from '@angular/core';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'qc-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss']
})
export class ReleaseComponent implements OnInit {
  @Input() assessmentId;
  @Input('existingRelease') release;
  @Input() utilitiesService;

  alertKeyError: string = 'releaseError';
  alertKeySuccess: string = 'releaseSuccess';
  error;
  success;

  constructor(private manageService: ManageService) { }

  ngOnInit() {
  }

  async createRelease() {
  		let data;
		const releaseData = { 'assessmentId': this.assessmentId, 'ltiContextId': this.utilitiesService.contextId };

		try {
			const resp = await this.manageService.createRelease(releaseData);
			data = this.utilitiesService.getResponseData(resp);
		}
		catch (error) {
			this.error = this.utilitiesService.getError(error);
		  	this.success = false; //reset if necessary
			this.utilitiesService.showAlert(this.alertKeyError, `Release failed: ${this.error}`, null, { variant: 'danger', focus: true });
		  	return;
		}

	  this.release = data.release;
		this.error = false; //reset this if it was set previously
		this.success = 'Release successful';
		this.utilitiesService.showAlert(this.alertKeySuccess, this.success, null, { variant: 'success', focus: true });
	}

	async rollbackRelease() {
		let data;

		try {
			const resp = await this.manageService.rollbackRelease(this.release.id);
			data = this.utilitiesService.getResponseData(resp);
		}
		catch (error) {
			this.error = this.utilitiesService.getError(error);
		  	this.success = false; //reset if necessary
		  	this.utilitiesService.showAlert(this.alertKeyError, `Rollback failed: ${this.error}`, null, { variant: 'danger', focus: true });
		  	return;
		}

		this.release = false; //remove the existing release
		this.success = 'Release successfully rolled back';
		this.error = false; //reset this if it was set previously
		this.utilitiesService.showAlert(this.alertKeySuccess, this.success, null, { variant: 'success', focus: true });
	}
}
