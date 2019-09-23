import { Component, Input, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {
  @Input() errorMessage;

  constructor(public utilitiesService: UtilitiesService,) { }

  ngOnInit() {
  }

  onRestart() {
    window.location.reload();
  }

}
