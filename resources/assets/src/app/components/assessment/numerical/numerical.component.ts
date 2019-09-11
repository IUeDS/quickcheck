import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-numerical',
  templateUrl: './numerical.component.html',
  styleUrls: ['./numerical.component.scss']
})
export class NumericalComponent implements OnInit {
  answer = null;

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
