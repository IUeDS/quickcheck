import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'qc-invite-admin',
  templateUrl: './invite-admin.component.html',
  styleUrls: ['./invite-admin.component.scss']
})
export class InviteAdminComponent implements OnInit {
  @Input() utilitiesService;

  validationAlertKey: string = 'validateAdminAlert';
  successAlertKey: string = 'addAdminSuccess';
  errorAlertKey: string = 'addAdminError';
  isEnteringUsername = false;
  formOpen = false;
  username = null;
  validationError = false;
  saveError = false;
  saveErrorReason = null;
  userAdded = false;
  userValidated = false;
  validatedUser = null;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  close() {
    this.formOpen = false;
  }

  openForm() {
    this.reset();
    this.formOpen = true;
  }

  reset() {
    this.username = null;
    this.validationError = false;
    this.saveError = false;
    this.userValidated = false;
    this.userAdded = false;
    this.isEnteringUsername = true;
  }

  async saveUser() {
    var user = {'username': this.username};
    this.saveError = false; //reset if set previously

    try {
      await this.userService.addAdmin(user);
      this.userAdded = true;
      this.utilitiesService.loadingFinished();
      this.utilitiesService.showAlert(this.successAlertKey, `Admin user added successfully: ${this.username}.`, null, { variant: 'success' });
    }
    catch (error) {
      this.saveErrorReason = this.utilitiesService.getError(error);
      this.saveError = true;
      this.utilitiesService.loadingFinished();
      this.utilitiesService.showAlert(this.errorAlertKey, `Error adding admin user: ${this.saveErrorReason}`, null, { variant: 'danger', focus: true });
    }
  }

  async validateUser() {
    let resp;
    let data;
    this.utilitiesService.loadingStarted();
    this.validationError = false; //reset if set previously

    try {
      resp = await this.userService.validateUser({'username': this.username});
      data = this.utilitiesService.getResponseData(resp);
    }
    catch (error) {
      this.validateUserError('Error validating user. Please try again.');
      return;
    }

    if (this.utilitiesService.isSuccessResponse(resp)) {
      this.validatedUser = data.user;
      this.userValidated = true;
      await this.saveUser();
    }
    else {
        this.validateUserError('User cannot be found. Please try again.');
        return;
    }
  }

  validateUserError(message: string) {
    this.utilitiesService.showAlert(this.validationAlertKey, message, null, { variant: 'danger' });
    this.validationError = true;
    this.utilitiesService.loadingFinished();
    document.getElementById('username')?.focus();
  }

}
