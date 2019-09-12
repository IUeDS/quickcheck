import { Component, OnInit, Input } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'qc-view-all-collections-toggle',
  templateUrl: './view-all-collections-toggle.component.html',
  styleUrls: ['./view-all-collections-toggle.component.scss']
})
export class ViewAllCollectionsToggleComponent implements OnInit {
  @Input() collectionData;
  @Input() utilitiesService;

  //because this could be a data-intensive operation if there are many collections, just
  //run once; don't allow user to toggle a million times
  previousRequestMade = false;

  constructor(private collectionService: CollectionService) { }

  ngOnInit() {
  }

}
