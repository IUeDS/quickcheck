import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RandomizeCheckboxComponent } from './randomize-checkbox.component';

describe('RandomizeCheckboxComponent', () => {
  let component: RandomizeCheckboxComponent;
  let fixture: ComponentFixture<RandomizeCheckboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomizeCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomizeCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
