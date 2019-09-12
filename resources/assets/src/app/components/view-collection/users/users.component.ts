import { Component, OnInit, Input } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';
import { UserService } from '../../../services/user.service';

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
  isAddingUser = {};
  isEditingUsers = {};
  showUsers = false;

  constructor(private collectionService: CollectionService, private userService: UserService) { }

  ngOnInit() {
  }

}
