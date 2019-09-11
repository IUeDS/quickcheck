import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent implements OnInit {

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
