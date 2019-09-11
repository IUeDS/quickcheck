import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';
import { UserService } from '../../../services/user.service';

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

  constructor(private collectionService: CollectionService, private userService: UserService) { }

  ngOnInit() {
  }

}
