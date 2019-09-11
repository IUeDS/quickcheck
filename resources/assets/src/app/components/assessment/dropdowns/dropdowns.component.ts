import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-dropdowns',
  templateUrl: './dropdowns.component.html',
  styleUrls: ['./dropdowns.component.scss']
})
export class DropdownsComponent implements OnInit {
  prompts = [];
  selectableAnswers = [];

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
