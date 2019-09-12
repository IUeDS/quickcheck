import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qc-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  @Input() utilitiesService;
  @Input() collectionData;

  constructor() { }

  ngOnInit() {
  }

}
