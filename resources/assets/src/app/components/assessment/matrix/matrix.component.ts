import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  columns = [];
  rows = [];

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
