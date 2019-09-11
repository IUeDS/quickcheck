import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-qti-export',
  templateUrl: './qti-export.component.html',
  styleUrls: ['./qti-export.component.scss']
})
export class QtiExportComponent implements OnInit {

  assessmentList = null;
  assessments = null;
  checkAll = false;

  constructor() { }

  ngOnInit() {
  }

}
