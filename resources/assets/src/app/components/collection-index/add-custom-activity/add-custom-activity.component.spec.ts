import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCustomActivityComponent } from './add-custom-activity.component';

describe('AddCustomActivityComponent', () => {
  let component: AddCustomActivityComponent;
  let fixture: ComponentFixture<AddCustomActivityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
