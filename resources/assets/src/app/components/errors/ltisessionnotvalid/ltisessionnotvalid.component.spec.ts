import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LtisessionnotvalidComponent } from './ltisessionnotvalid.component';

describe('LtisessionnotvalidComponent', () => {
  let component: LtisessionnotvalidComponent;
  let fixture: ComponentFixture<LtisessionnotvalidComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LtisessionnotvalidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LtisessionnotvalidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
