import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-invite-admin',
  templateUrl: './invite-admin.component.html',
  styleUrls: ['./invite-admin.component.scss']
})
export class InviteAdminComponent implements OnInit {
  isEnteringUsername = false;
  formOpen = false;
  username = null;
  validationError = false;
  saveError = false;
  saveErrorReason = null;
  userAdded = false;
  userValidated = false;
  validatedUser = null;

  constructor() { }

  ngOnInit() {
  }

}
