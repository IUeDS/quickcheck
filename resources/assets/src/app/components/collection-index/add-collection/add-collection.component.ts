import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'qc-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss']
})
export class AddCollectionComponent implements OnInit {
  isAddingCollection = false;
  newCollection = {};

  constructor(private collectionService: CollectionService) { }

  ngOnInit() {
  }

}
