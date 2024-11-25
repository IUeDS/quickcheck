import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-ltisessionnotvalid',
  templateUrl: './ltisessionnotvalid.component.html',
  styleUrls: ['./ltisessionnotvalid.component.scss']
})
export class LtisessionnotvalidComponent implements OnInit {

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.utilitiesService.setTitle('LTI Session Not Valid - Quick Check');
  }

}
