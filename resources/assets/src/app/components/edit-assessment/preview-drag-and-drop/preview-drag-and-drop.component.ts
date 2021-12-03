import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'qc-preview-drag-and-drop',
  templateUrl: './preview-drag-and-drop.component.html',
  styleUrls: ['./preview-drag-and-drop.component.scss']
})
export class PreviewDragAndDropComponent implements OnInit {
  @Input() currentQuestion;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

}
