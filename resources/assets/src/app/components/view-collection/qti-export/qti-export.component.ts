import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qc-qti-export',
  templateUrl: './qti-export.component.html',
  styleUrls: ['./qti-export.component.scss']
})
export class QtiExportComponent implements OnInit {
  @Input() assessmentGroups;
  @Input() isExportingQti;

  assessmentList = null;
  assessments = null;
  checkAll = false;

  constructor() { }

  ngOnInit() {
  }

}
