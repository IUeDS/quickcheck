import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentGroupComponent } from './assessment-group.component';

describe('AssessmentGroupComponent', () => {
  let component: AssessmentGroupComponent;
  let fixture: ComponentFixture<AssessmentGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
