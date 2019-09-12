import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'qc-attempt-data',
  templateUrl: './attempt-data.component.html',
  styleUrls: ['./attempt-data.component.scss']
})
export class AttemptDataComponent implements OnInit {
  @Input() attempts;
  @Input() courseContext;
  @Input() gradesLoading;
  @Input() isStudent;
  @Input() isVisible;
  @Input() largeClassSize;
  @Output() onViewResponses = new EventEmitter();
  @Input() pointsPossible;
  @Input() showResponses;
  @Input() submissions;
  @Input() users;
  @Input() utilitiesService;

  numAttemptsDisplayed = 100;
  studentsWithFirstRow = {}; //for tracking table borders, etc.

  constructor() { }

  ngOnInit() {
  }

}
