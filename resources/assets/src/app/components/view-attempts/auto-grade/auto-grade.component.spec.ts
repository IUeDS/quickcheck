import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AutoGradeComponent } from './auto-grade.component';

describe('AutoGradeComponent', () => {
  let component: AutoGradeComponent;
  let fixture: ComponentFixture<AutoGradeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
