import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMatrixComponent } from './edit-matrix.component';

describe('EditMatrixComponent', () => {
  let component: EditMatrixComponent;
  let fixture: ComponentFixture<EditMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
