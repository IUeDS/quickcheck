import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionnotvalidComponent } from './sessionnotvalid.component';

describe('SessionnotvalidComponent', () => {
  let component: SessionnotvalidComponent;
  let fixture: ComponentFixture<SessionnotvalidComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionnotvalidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionnotvalidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
