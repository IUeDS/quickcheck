import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttemptsForStudentComponent } from './view-attempts-for-student.component';

describe('ViewAttemptsForStudentComponent', () => {
  let component: ViewAttemptsForStudentComponent;
  let fixture: ComponentFixture<ViewAttemptsForStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAttemptsForStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAttemptsForStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
