import { Component, OnInit } from '@angular/core';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'qc-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss']
})
export class ReleasesComponent implements OnInit {
  releases = [];
  search = {'assessmentName': ''}; //for searching through attempts

  constructor(private manageService: ManageService) { }

  ngOnInit() {
  }

}
