import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-multiple-correct',
  templateUrl: './multiple-correct.component.html',
  styleUrls: ['./multiple-correct.component.scss']
})
export class MultipleCorrectComponent implements OnInit {

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
