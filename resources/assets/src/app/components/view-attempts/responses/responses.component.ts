import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {

  showTableView = false;
  correctIconClass = 'fa-long-arrow-right'; //so we can easily swap out the correct icon

  constructor() { }

  ngOnInit() {
  }

}
