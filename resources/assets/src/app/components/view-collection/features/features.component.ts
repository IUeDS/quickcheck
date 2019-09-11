import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  collectionFeatures = [];
  showFeatures = false;

  constructor() { }

  ngOnInit() {
  }

}
