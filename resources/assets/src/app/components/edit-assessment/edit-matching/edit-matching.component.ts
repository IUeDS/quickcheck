import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-matching',
  templateUrl: './edit-matching.component.html',
  styleUrls: ['./edit-matching.component.scss']
})
export class EditMatchingComponent implements OnInit {

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
