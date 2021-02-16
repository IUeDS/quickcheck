import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatchingComponent } from './matching.component';

describe('MatchingComponent', () => {
  let component: MatchingComponent;
  let fixture: ComponentFixture<MatchingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
