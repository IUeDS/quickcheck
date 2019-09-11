import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss']
})
export class AddCollectionComponent implements OnInit {
  isAddingCollection = false;
  newCollection = {};

  constructor() { }

  ngOnInit() {
  }

}
