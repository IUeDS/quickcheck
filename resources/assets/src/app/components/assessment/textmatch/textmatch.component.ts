import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-textmatch',
  templateUrl: './textmatch.component.html',
  styleUrls: ['./textmatch.component.scss']
})
export class TextmatchComponent implements OnInit {

  answer = null;

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
