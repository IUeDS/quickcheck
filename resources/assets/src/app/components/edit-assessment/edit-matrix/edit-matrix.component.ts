import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-matrix',
  templateUrl: './edit-matrix.component.html',
  styleUrls: ['./edit-matrix.component.scss']
})
export class EditMatrixComponent implements OnInit {

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
