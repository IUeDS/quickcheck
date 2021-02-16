import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMatchingComponent } from './edit-matching.component';

describe('EditMatchingComponent', () => {
  let component: EditMatchingComponent;
  let fixture: ComponentFixture<EditMatchingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
