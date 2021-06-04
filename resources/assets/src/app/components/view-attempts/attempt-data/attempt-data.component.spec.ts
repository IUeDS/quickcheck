import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttemptDataComponent } from './attempt-data.component';

describe('AttemptDataComponent', () => {
  let component: AttemptDataComponent;
  let fixture: ComponentFixture<AttemptDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttemptDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttemptDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
