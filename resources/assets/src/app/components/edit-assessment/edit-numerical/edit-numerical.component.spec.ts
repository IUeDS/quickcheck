import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNumericalComponent } from './edit-numerical.component';

describe('EditNumericalComponent', () => {
  let component: EditNumericalComponent;
  let fixture: ComponentFixture<EditNumericalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNumericalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNumericalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
