import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'qc-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  collectionFeatures = [];
  showFeatures = false;

  constructor(private collectionService: CollectionService) { }

  ngOnInit() {
  }

}
