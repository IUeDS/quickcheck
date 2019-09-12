import { Component, OnInit, Input } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'qc-toggle-public-collection',
  templateUrl: './toggle-public-collection.component.html',
  styleUrls: ['./toggle-public-collection.component.scss']
})
export class TogglePublicCollectionComponent implements OnInit {
  @Input() collection;
  @Input() utilitiesService;

  constructor(private collectionService: CollectionService) { }

  ngOnInit() {
  }

}
