import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-sessionnotvalid',
  templateUrl: './sessionnotvalid.component.html',
  styleUrls: ['./sessionnotvalid.component.scss']
})
export class SessionnotvalidComponent implements OnInit {

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.utilitiesService.setTitle('Quick Check - Session Not Valid');
  }

}
