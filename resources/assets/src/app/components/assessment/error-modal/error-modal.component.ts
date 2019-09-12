import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'qc-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {
  @Input() errorMessage;

  constructor() { }

  ngOnInit() {
  }

}
