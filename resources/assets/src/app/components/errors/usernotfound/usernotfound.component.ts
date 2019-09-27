import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-usernotfound',
  templateUrl: './usernotfound.component.html',
  styleUrls: ['./usernotfound.component.scss']
})
export class UsernotfoundComponent implements OnInit {

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.utilitiesService.setTitle('Quick Check - User Not Found');
  }

}
