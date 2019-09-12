import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qc-qti-import-btn',
  templateUrl: './qti-import-btn.component.html',
  styleUrls: ['./qti-import-btn.component.scss']
})
export class QtiImportBtnComponent implements OnInit {
  @Input() isImportingQti;

  constructor() { }

  ngOnInit() {
  }

}
