import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {

  editedGradeValue = '';
  editingGrade = false;
  error = false;
  gradeLoading = false;
  isUserInCourse = true;
  submission = null;

  constructor() { }

  ngOnInit() {
  }

}
