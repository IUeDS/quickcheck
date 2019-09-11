import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { UserService } from '../../services/user.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'qc-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.scss']
})
export class ViewCollectionComponent implements OnInit {

  collectionId = false;
  collection = null;
  currentPage = 'sets';
  readOnly = false; //if user has read-only permissions, they can't see certain options
  assessmentGroups = [];
  isImportingQti = false;
  isExportingQti = false;
  currentUser = {};
  admin = false;
  searchResults = null;
  searchTerm = '';

  constructor(
    private utilitiesService: UtilitiesService,
    private userService: UserService,
    private collectionService: CollectionService
  ) { }

  ngOnInit() {
  }

}
