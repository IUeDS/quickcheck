import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qc-qti-export-btn',
  templateUrl: './qti-export-btn.component.html',
  styleUrls: ['./qti-export-btn.component.scss']
})
export class QtiExportBtnComponent implements OnInit {
  @Input() isExportingQti;

  constructor() { }

  ngOnInit() {
  }

  initQtiExport() {
    this.isExportingQti = true;
  }

}
