import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssessmentGroupComponent } from './add-assessment-group.component';

describe('AddAssessmentGroupComponent', () => {
  let component: AddAssessmentGroupComponent;
  let fixture: ComponentFixture<AddAssessmentGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssessmentGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssessmentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
