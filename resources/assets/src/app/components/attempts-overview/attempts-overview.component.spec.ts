import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttemptsOverviewComponent } from './attempts-overview.component';

describe('AttemptsOverviewComponent', () => {
  let component: AttemptsOverviewComponent;
  let fixture: ComponentFixture<AttemptsOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttemptsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttemptsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
