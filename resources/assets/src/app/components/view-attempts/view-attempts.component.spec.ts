import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttemptsComponent } from './view-attempts.component';

describe('ViewAttemptsComponent', () => {
  let component: ViewAttemptsComponent;
  let fixture: ComponentFixture<ViewAttemptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAttemptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAttemptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
