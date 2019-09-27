import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMultipleChoiceComponent } from './edit-multiple-choice.component';

describe('EditMultipleChoiceComponent', () => {
  let component: EditMultipleChoiceComponent;
  let fixture: ComponentFixture<EditMultipleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMultipleChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
