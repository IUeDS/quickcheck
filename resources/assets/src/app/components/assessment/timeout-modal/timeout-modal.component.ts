import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import moment from 'moment-timezone';

@Component({
  selector: 'qc-timeout-modal',
  templateUrl: './timeout-modal.component.html',
  styleUrls: ['./timeout-modal.component.scss']
})
export class TimeoutModalComponent implements OnInit {
  @Input() timeoutSecondsRemaining;
  @Output() onRestart = new EventEmitter();

  countdownAnimation = null; //path for svg to animate
  countdownIncrement = 0; //how much of the circle to increment each repaint; calculated in $onInit
  countdownProgress = 0; //animation progress
  countdownRadius = 50;
  countdownRepaint = 60; //time in ms for animation to repaint
  timeoutFinished = false;
  timeoutFinishedTime = null;
  timeoutMsRemaining = 0;
  timeoutStartedTime = null;
  timerInterval = null;

  constructor(
    private bsModalRef: BsModalRef,
    private bsModalService: BsModalService
  ) { }

  ngOnInit() {
    if (!this.timeoutSecondsRemaining) {
      return false;
    }

    this.timeoutStartedTime = moment();
    this.timeoutFinishedTime = moment().add(this.timeoutSecondsRemaining, 'seconds');
    this.timeoutMsRemaining = this.timeoutSecondsRemaining * 1000;
    //the amount of the circle that should be incremented on each repaint; calculated as
    //a proportion of total degrees in circle and repaint time divided by total time
    this.countdownIncrement = (this.countdownRepaint * 360) / this.timeoutMsRemaining;
    this.runTimer();
  }

  //adapted from: https://codepen.io/anon/pen/OERKRN
  //using time-specific animation with moment.js, because timeout functions will
  //be halted if the user switches tabs, leading to an inaccurate countdown graphic.
  //when user switches back to tab, accurate timer (or completed timer) will be shown.
  incrementTimer() {
    var incrementsPassed,
      mid,
      now = moment(),
      r,
      timeDifference,
      x,
      y;

    if (now.isSameOrAfter(this.timeoutFinishedTime)) {
      this.timeoutFinished = true;
      clearInterval(this.timerInterval);
      return;
    }

    timeDifference = moment.duration(now.diff(this.timeoutStartedTime)).asMilliseconds();
    incrementsPassed = timeDifference / this.countdownRepaint;
    this.countdownProgress = this.countdownIncrement * incrementsPassed % 360;
    r = this.countdownProgress * Math.PI / 180;
    x = Math.sin(r) * this.countdownRadius;
    y = Math.cos(r) * - this.countdownRadius;
    mid = (this.countdownProgress > 180) ? 1 : 0;
    this.countdownAnimation = 'M 0 0 v -' + this.countdownRadius +
      ' A ' + this.countdownRadius + ' ' + this.countdownRadius +
      ' 1 ' + mid + ' 1 ' + x + ' ' + y + ' z';
  }

  restart() {
    this.bsModalService.setDismissReason('restart');
    this.bsModalRef.hide();
  }

  runTimer() {
    this.timerInterval = setInterval(() => {
      this.incrementTimer();
    }, this.countdownRepaint);
  }

}
