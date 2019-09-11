import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentGroupsComponent } from './assessment-groups.component';

describe('AssessmentGroupsComponent', () => {
  let component: AssessmentGroupsComponent;
  let fixture: ComponentFixture<AssessmentGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
