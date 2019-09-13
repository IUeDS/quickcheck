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

  async toggleViewAll() {
    this.collectionData.viewAll = !this.collectionData.viewAll;
    if (this.collectionData.viewAll && !this.previousRequestMade) {
      await this.getAllCollections();
    }
  }

  async getAllCollections() {
    let data;
    this.utilitiesService.loadingStarted();

    try {
      const resp = await this.collectionService.getCollectionsWithAssessments();
      data = this.utilitiesService.getResponseData(resp);
    }
    catch (error) {
      this.utilitiesService.showError(error);
      return;
    }

    this.collectionData.collections = data.collections;
    this.utilitiesService.loadingFinished();
    this.previousRequestMade = true;
  }
}
