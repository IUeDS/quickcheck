import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qc-select-collection-panel',
  templateUrl: './select-collection-panel.component.html',
  styleUrls: ['./select-collection-panel.component.scss']
})
export class SelectCollectionPanelComponent implements OnInit {
  @Input() collection;
  @Input() membership;
  @Input() redirectUrl;
  @Input() launchUrlStem;

  constructor() { }

  ngOnInit() {
  }

}
