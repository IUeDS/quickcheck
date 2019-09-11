import { Component, OnInit } from '@angular/core';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'qc-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss']
})
export class ReleaseComponent implements OnInit {

  error = false;
  success = false;

  constructor(private manageService: ManageService) { }

  ngOnInit() {
  }

}
