import { Component, OnInit, Input } from '@angular/core';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'qc-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss']
})
export class ReleaseComponent implements OnInit {
  @Input() assessmentId;
  @Input() release;
  @Input() utilitiesService;

  error = false;
  success = false;

  constructor(private manageService: ManageService) { }

  ngOnInit() {
  }

}
