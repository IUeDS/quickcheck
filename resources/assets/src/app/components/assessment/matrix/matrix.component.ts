import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  columns = [];
  rows = [];

  constructor() { }

  ngOnInit() {
  }

}
