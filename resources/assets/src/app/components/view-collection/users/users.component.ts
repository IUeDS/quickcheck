import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  collectionUsers = [];
  isAddingUser = {};
  isEditingUsers = {};
  showUsers = false;

  constructor() { }

  ngOnInit() {
  }

}
