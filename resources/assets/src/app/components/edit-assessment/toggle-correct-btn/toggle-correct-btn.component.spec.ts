import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleCorrectBtnComponent } from './toggle-correct-btn.component';

describe('ToggleCorrectBtnComponent', () => {
  let component: ToggleCorrectBtnComponent;
  let fixture: ComponentFixture<ToggleCorrectBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleCorrectBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleCorrectBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
