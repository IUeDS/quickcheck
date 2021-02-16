import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeoutModalComponent } from './timeout-modal.component';

describe('TimeoutModalComponent', () => {
  let component: TimeoutModalComponent;
  let fixture: ComponentFixture<TimeoutModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeoutModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
