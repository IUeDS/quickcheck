import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'qc-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss']
})
export class ReleasesComponent implements OnInit {
  @Input() utilitiesService;
  @Output() onViewAttempts = new EventEmitter();

  releases = [];
  search = {'assessmentName': ''}; //for searching through attempts

  constructor(private manageService: ManageService) { }

  ngOnInit() {
  }

}
