import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericalComponent } from './numerical.component';

describe('NumericalComponent', () => {
  let component: NumericalComponent;
  let fixture: ComponentFixture<NumericalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumericalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
