import { Component, OnInit, Input } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';
import { UserService } from '../../../services/user.service';
import cloneDeep from 'lodash/cloneDeep';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'qc-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Input() collectionId;
  @Input() currentUser;
  @Input() readOnly;
  @Input() utilitiesService;

  collectionUsers = [];
  isAddingUser = {
    init: false,
    checkUser: false,
    readOnly: null,
    saveError: false,
    saveErrorReason: false,
    username: '',
    userAdded: false,
    userValidated: false,
    validationError: false,
    validatedUser: { name: null }
  };
  isEditingUsers = {
    init: false,
    loading: false,
    error: false,
    success: false,
    users: []
  };
  showUsers = false;

  constructor(
    private collectionService: CollectionService, 
    private userService: UserService,
    private router: Router, 
    private route: ActivatedRoute) { }

  async ngOnInit() {
    await this.getCollectionUsers();
  }

  addUserCancel() {
    this.isAddingUser.init = false;
  }

  deleteMembership(user) {
    user.deleted = true;
  }

  editUsersCancel() {
    this.isEditingUsers.init = false; //reset
  }

  async getCollectionUsers() {
    let data;

    try {
      const resp = await this.collectionService.getCollectionMembership(this.collectionId);
      data = this.utilitiesService.getResponseData(resp);
    }
    catch (error) {
      this.utilitiesService.showError(error);
      return;
    }

    this.collectionUsers = data.users;
  }

  isAddingUserInit() {
    //reset
    this.isAddingUser.init = true;
    this.isAddingUser.checkUser = true;
    this.isAddingUser.readOnly = null;
    this.isAddingUser.username = '';
    this.isAddingUser.userAdded = false;
    this.isAddingUser.userValidated = false;
    this.isEditingUsers.success = false; //reset to hide success box, if visible

    //move focus to appropriate header to orient screenreader users
    this.utilitiesService.focusToElement('#invite-user-header');
  }

  isEditingUsersInit() {
    this.isEditingUsers.init = true;
    this.isEditingUsers.users = cloneDeep(this.collectionUsers);
    //move focus to appropriate header to orient screenreader users
    this.utilitiesService.focusToElement('#edit-users-header');
  }

  showAlertPopUp(): boolean {
    let showAlertPopup = false;
    let confirmEdits = true;

    this.isEditingUsers.users.forEach(user => {
      if (user.username == this.currentUser.username && user.deleted) {
        showAlertPopup = true;
        return;
      }
    });
    if (showAlertPopup) {
      // Show pop here
      confirmEdits = confirm('You are removing your access to this set. Do you want to proceed?');
    }
    return confirmEdits;
  }

  saveUserEdits() {
    if (this.showAlertPopUp()) {
      let data;
      this.isEditingUsers.loading = true;
      this.isEditingUsers.init = false;
      
      this.collectionService.updateCollectionMembership(this.collectionId, this.isEditingUsers).subscribe(resp => {
        data = this.utilitiesService.getResponseData(resp);

        this.isEditingUsers.loading = false;
        this.collectionUsers = data.users;
        this.isEditingUsers.success = true;

        if (data.length === 0) {
          this.router.navigateByUrl('/');
        }
      }, error => {
        this.isEditingUsers.loading = false;
        this.isEditingUsers.error = true;
        this.isEditingUsers.init = true; //show editing view again so they can redo
        return;
      });

      
    }
  }

  async saveUserMembership() {
    const membershipData = {
      'username': this.isAddingUser.username,
      'collectionId': this.collectionId,
      'readOnly': this.isAddingUser.readOnly ? 'true' : null
    };
    this.isAddingUser.saveError = false;

    try {
      await this.collectionService.createMembership(membershipData);
      this.isAddingUser.userAdded = true;
      await this.getCollectionUsers();
    }
    catch (error) {
      this.isAddingUser.saveError = true;
      this.isAddingUser.saveErrorReason = this.utilitiesService.getError(error);
      return;
    }
  }

  toggleReadOnly(user) {
    if (user.readOnly == 'true') {
      user.readOnly = null;
    }
    else {
      user.readOnly = 'true';
    }
  }

  toggleShowUsers() {
    this.showUsers = !(this.showUsers);
    this.utilitiesService.setLtiHeight();
  }

  async validateUser() {
    let data;
    let resp;
    const user = { 'username': this.isAddingUser.username };
    this.isAddingUser.validationError = false;

    try {
      resp = await this.userService.validateUser(user);
      data = this.utilitiesService.getResponseData(resp);
    }
    catch (error) {
      this.isAddingUser.validationError = true;
      return;
    }

    if (!this.utilitiesService.isSuccessResponse(resp)) {
      this.isAddingUser.validationError = true;
      return;
    }

    this.isAddingUser.validatedUser = data.user;
    this.isAddingUser.checkUser = false;
    this.isAddingUser.userValidated = true;
    await this.saveUserMembership();
  }

}
