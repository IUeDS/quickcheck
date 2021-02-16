import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatrixComponent } from './matrix.component';

describe('MatrixComponent', () => {
  let component: MatrixComponent;
  let fixture: ComponentFixture<MatrixComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
