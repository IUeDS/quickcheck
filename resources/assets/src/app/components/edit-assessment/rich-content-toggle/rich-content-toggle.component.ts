import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-rich-content-toggle',
  templateUrl: './rich-content-toggle.component.html',
  styleUrls: ['./rich-content-toggle.component.scss']
})
export class RichContentToggleComponent implements OnInit {

  isToggled = false;

  constructor() { }

  ngOnInit() {
  }

}
