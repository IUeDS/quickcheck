import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-textmatch',
  templateUrl: './edit-textmatch.component.html',
  styleUrls: ['./edit-textmatch.component.scss']
})
export class EditTextmatchComponent implements OnInit {

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
