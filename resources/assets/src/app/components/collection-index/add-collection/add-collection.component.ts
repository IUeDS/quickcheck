import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'qc-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss']
})
export class AddCollectionComponent implements OnInit {
  @Input() utilitiesService;
  @Output() onSave = new EventEmitter();

  isAddingCollection = false;
  newCollection = {};

  constructor(private collectionService: CollectionService) { }

  ngOnInit() {
  }

}
