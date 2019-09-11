import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-numerical',
  templateUrl: './edit-numerical.component.html',
  styleUrls: ['./edit-numerical.component.scss']
})
export class EditNumericalComponent implements OnInit {

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
