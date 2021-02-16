import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudentViewComponent } from './student-view.component';

describe('StudentViewComponent', () => {
  let component: StudentViewComponent;
  let fixture: ComponentFixture<StudentViewComponent>;

  beforeEach(waitForAsync(() => {
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
