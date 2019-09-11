import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'qc-public-collections',
  templateUrl: './public-collections.component.html',
  styleUrls: ['./public-collections.component.scss']
})
export class PublicCollectionsComponent implements OnInit {
  publicCollections = false;

  constructor(private collectionService: CollectionService, private userService: UserService) { }

  ngOnInit() {
  }

}
