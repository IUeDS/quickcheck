import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMultipleCorrectComponent } from './edit-multiple-correct.component';

describe('EditMultipleCorrectComponent', () => {
  let component: EditMultipleCorrectComponent;
  let fixture: ComponentFixture<EditMultipleCorrectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMultipleCorrectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMultipleCorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
