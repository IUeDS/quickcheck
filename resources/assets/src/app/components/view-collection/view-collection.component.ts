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

  collectionId;
  collection = null;
  currentPage = 'sets';
  readOnly = false; //if user has read-only permissions, they can't see certain options
  assessmentGroups = [];
  isImportingQti = false;
  isExportingQti = false;
  currentUser;
  admin = false;
  searchResults = null;
  searchTerm = '';

  constructor(
    private utilitiesService: UtilitiesService,
    private userService: UserService,
    private collectionService: CollectionService
  ) { }

  async ngOnInit() {
    this.collectionId = this.getCollectionIdFromUrl();
    await this.getCollection();
    await this.getUser();
  }

    //get the collection and all assessmentgroups/assessments from the DB
  async getCollection() {
    this.utilitiesService.loadingStarted();
    let data;

    try {
      const resp = await this.collectionService.getCollection(this.collectionId);
      data = this.utilitiesService.getResponseData(resp);
    }
    catch (error) {
      this.utilitiesService.showError(error);
      return;
    }

    this.collection = data.collection;
    this.assessmentGroups = data.assessmentGroups;
    this.readOnly = data.readOnly;
    this.utilitiesService.loadingFinished();
  }

  getCollectionIdFromUrl() {
    //get the collection id from the Laravel url, /collection/{id}
    var splitUrl = window.location.href.split('/'),
      lastParam = splitUrl[splitUrl.length - 1],
      splitQuery = lastParam.split('?'), //even if no query string, returns single string in array to grab
      collectionId = splitQuery[0];

    return collectionId;
  }

  async getUser() {
    let data;

    try {
      const resp = await this.userService.getUser();
      data = this.utilitiesService.getResponseData(resp);
    }
    catch (error) {
      this.utilitiesService.showError(error);
      return;
    }

    this.currentUser = data.user;
    if (this.currentUser.admin == 'true') {
      this.admin = true;
    }
  }

  onAssessmentCopy($event) {
    var assessment = $event.assessment;

    this.assessmentGroups.forEach(function(assessmentGroup) {
      if (assessmentGroup.id == assessment.assessment_group_id) {
        assessmentGroup.assessments.push(assessment);
      }
    });
  }

  onAssessmentGroupDeleted($event) {
    var assessmentGroupIndex = $event.assessmentGroupIndex;
    this.assessmentGroups.splice(assessmentGroupIndex, 1);
  }

  onAssessmentGroupSaved($event) {
    var newAssessmentGroup = $event.newAssessmentGroup;
    this.assessmentGroups.push(newAssessmentGroup);
    //focus to newly created assessment group to orient screenreader users
    this.utilitiesService.focusToElement('#heading-group-' + newAssessmentGroup.id);
  }

  async search() {
    //TODO: add debounce of 500 ms using observable
    if (!this.searchTerm) {
      return;
    }

    this.utilitiesService.loadingStarted();
    let data;

    try {
      const resp = await this.collectionService.search(this.collectionId, this.searchTerm);
      data = this.utilitiesService.getResponseData(resp);
    }
    catch (error) {
      this.utilitiesService.showError(error);
      return;
    }

    this.searchResults = data.searchResults;
    this.utilitiesService.loadingFinished();
  }
}
