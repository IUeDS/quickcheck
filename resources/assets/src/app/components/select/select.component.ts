import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  user = {};
  admin = false;
  memberships = [];
  assessments = [];
  //there isn't an angular-friendly way to grab server-side embedded values in html, unfortunately...
  redirectUrl = (<HTMLInputElement>document.getElementById('#redirect-url')).value;
  launchUrlStem = (<HTMLInputElement>document.getElementById('#launch-url-stem')).value;
  search = {
    searchText: '',
    searchActivated: false,
    searchResults: []
  };
  adminCollectionData = {
      'viewAll': false,
      'collections': []
  };


  constructor() { }

  ngOnInit() {
  }

}
