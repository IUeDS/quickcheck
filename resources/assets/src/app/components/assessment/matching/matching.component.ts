import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements OnInit {
  prompts = [];
  selectableAnswers = [];

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
