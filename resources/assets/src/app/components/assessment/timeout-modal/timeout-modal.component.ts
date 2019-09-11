import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-timeout-modal',
  templateUrl: './timeout-modal.component.html',
  styleUrls: ['./timeout-modal.component.scss']
})
export class TimeoutModalComponent implements OnInit {

  countdownAnimation = null; //path for svg to animate
  countdownIncrement = 0; //how much of the circle to increment each repaint; calculated in $onInit
  countdownProgress = 0; //animation progress
  countdownRadius = 50;
  countdownRepaint = 60; //time in ms for animation to repaint
  timeoutFinished = false;
  timeoutFinishedTime = null;
  timeoutMsRemaining = 0;
  timeoutSecondsRemaining = 0;
  timeoutStartedTime = null;
  timerInterval = null;

  constructor() { }

  ngOnInit() {
  }

}
