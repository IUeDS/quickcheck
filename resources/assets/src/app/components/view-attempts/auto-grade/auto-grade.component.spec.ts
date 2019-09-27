import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoGradeComponent } from './auto-grade.component';

describe('AutoGradeComponent', () => {
  let component: AutoGradeComponent;
  let fixture: ComponentFixture<AutoGradeComponent>;

  beforeEach(async(() => {
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
