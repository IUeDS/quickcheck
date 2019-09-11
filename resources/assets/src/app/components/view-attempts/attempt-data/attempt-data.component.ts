import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-attempt-data',
  templateUrl: './attempt-data.component.html',
  styleUrls: ['./attempt-data.component.scss']
})
export class AttemptDataComponent implements OnInit {

  numAttemptsDisplayed = 100;
  studentsWithFirstRow = {}; //for tracking table borders, etc.

  constructor() { }

  ngOnInit() {
  }

}
