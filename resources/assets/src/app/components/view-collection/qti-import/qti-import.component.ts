import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-qti-import',
  templateUrl: './qti-import.component.html',
  styleUrls: ['./qti-import.component.scss']
})
export class QtiImportComponent implements OnInit {

  assessment_group_id = null;
  criticalNotices = null;
  done = false;
  error = false;
  notices = null;
  quizzes = null;
  uploading = false;
  utils = null;
  zipFile = null;

  constructor() { }

  ngOnInit() {
  }

}
