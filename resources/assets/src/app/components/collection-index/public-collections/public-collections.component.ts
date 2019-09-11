import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-public-collections',
  templateUrl: './public-collections.component.html',
  styleUrls: ['./public-collections.component.scss']
})
export class PublicCollectionsComponent implements OnInit {
  publicCollections = false;

  constructor() { }

  ngOnInit() {
  }

}
