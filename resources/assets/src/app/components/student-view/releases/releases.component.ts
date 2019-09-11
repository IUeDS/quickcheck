import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss']
})
export class ReleasesComponent implements OnInit {
  releases = [];
  search = {'assessmentName': ''}; //for searching through attempts

  constructor() { }

  ngOnInit() {
  }

}
