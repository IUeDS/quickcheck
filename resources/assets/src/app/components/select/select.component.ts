import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { UserService } from '../../services/user.service';
import { UtilitiesService } from '../../services/utilities.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'qc-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  user;
  admin = false;
  memberships = [];
  assessments = [];
  deploymentId;
  launchUrlStem;
  redirectUrl;
  search = {
    searchText: '',
    searchActivated: false,
    searchResults: []
  };
  adminCollectionData = {
    'viewAll': false,
    'collections': []
  };

  constructor(
  public utilitiesService: UtilitiesService,
  public userService: UserService,
  public collectionService: CollectionService
  ) {}

  async ngOnInit() {
    this.utilitiesService.setTitle('Quick Check - Select');
    this.launchUrlStem = this.utilitiesService.getQueryParam('launchUrlStem');
    this.redirectUrl = this.utilitiesService.getQueryParam('redirectUrl');
    this.deploymentId = this.utilitiesService.getQueryParam('deploymentId');

    await this.getMemberships();
  }

  clearSearch() {
    this.search.searchText = '';
    this.updateSearch();
  }

  //grab the assessments out of the collections/assessment groups to make search easier
  //differentiate between personal memberships vs. all collections for admins
  getAssessments() {
    var collections,
      assessments = [];

    if (this.adminCollectionData.viewAll) {
      collections = this.adminCollectionData.collections;
    }
    else {
      collections = this.memberships.map(function(membership) {
        return membership.collection;
      });
    }

    for (let collection of collections) {
      for (let assessmentGroup of collection.assessment_groups) {
        for (let assessment of assessmentGroup.assessments) {
          assessments.push(assessment);
        }
      }
    }

    return assessments;
  }

  async getMemberships() {
    let data;
    this.utilitiesService.loadingStarted();

    try {
      const resp = await this.collectionService.getMembershipsWithAssessments();
      data = this.utilitiesService.getResponseData(resp);
    }
    catch(error) {
      this.utilitiesService.showError(error);
      return;
    }

    this.memberships = data.memberships;
    this.utilitiesService.loadingFinished();
    await this.getUser(); //display admin features if an admin
  }

  async getUser() {
    let data;

    try {
      const resp = await this.userService.getUser();
      data = this.utilitiesService.getResponseData(resp);
    }
    catch(error) {
      this.utilitiesService.showError(error);
      return false;
    }

    this.user = data.user;
    if (this.user.admin == 'true') {
      this.admin = true;
    }
  }

  runSearch() {
    var assessments = this.getAssessments();
    this.search.searchResults = [];

    for (let assessment of assessments) {
      if (assessment.name.toLowerCase().indexOf(this.search.searchText) !== -1) {
        this.search.searchResults.push(assessment);
      }
    }
  }

  updateSearch() {
    if (this.search.searchText === '') {
      this.search.searchActivated = false;
      this.search.searchResults = [];
    }
    else {
      this.search.searchText = this.search.searchText.toLowerCase();
      this.runSearch();
      this.search.searchActivated = true;
    }
  }
}