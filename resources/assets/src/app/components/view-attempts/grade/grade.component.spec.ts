import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GradeComponent } from './grade.component';

describe('GradeComponent', () => {
  let component: GradeComponent;
  let fixture: ComponentFixture<GradeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
