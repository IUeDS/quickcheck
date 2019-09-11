import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleCorrectComponent } from './multiple-correct.component';

describe('MultipleCorrectComponent', () => {
  let component: MultipleCorrectComponent;
  let fixture: ComponentFixture<MultipleCorrectComponent>;

  beforeEach(async(() => {
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
