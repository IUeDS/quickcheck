import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultipleCorrectComponent } from './multiple-correct.component';

describe('MultipleCorrectComponent', () => {
  let component: MultipleCorrectComponent;
  let fixture: ComponentFixture<MultipleCorrectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleCorrectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleCorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
