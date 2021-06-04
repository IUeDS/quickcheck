import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewAttemptsForStudentComponent } from './view-attempts-for-student.component';

describe('ViewAttemptsForStudentComponent', () => {
  let component: ViewAttemptsForStudentComponent;
  let fixture: ComponentFixture<ViewAttemptsForStudentComponent>;

  beforeEach(waitForAsync(() => {
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
