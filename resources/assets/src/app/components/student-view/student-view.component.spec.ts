import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewComponent } from './student-view.component';

describe('StudentViewComponent', () => {
  let component: StudentViewComponent;
  let fixture: ComponentFixture<StudentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
