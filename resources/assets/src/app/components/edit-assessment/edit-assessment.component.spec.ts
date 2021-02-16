import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAssessmentComponent } from './edit-assessment.component';

describe('EditAssessmentComponent', () => {
  let component: EditAssessmentComponent;
  let fixture: ComponentFixture<EditAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
