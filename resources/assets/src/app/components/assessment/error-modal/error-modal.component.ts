import { Component, Input, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'qc-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {
  @Input() errorMessage;
  @Input() showRestartBtn;

  constructor(
    public utilitiesService: UtilitiesService,
    private bsModalRef: BsModalRef,
    private bsModalService: BsModalService) { }

  ngOnInit() {
  }

  restart() {
    this.bsModalService.setDismissReason('restart');
    this.bsModalRef.hide();
  }

}
