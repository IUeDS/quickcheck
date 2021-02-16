import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMultipleChoiceComponent } from './edit-multiple-choice.component';

describe('EditMultipleChoiceComponent', () => {
  let component: EditMultipleChoiceComponent;
  let fixture: ComponentFixture<EditMultipleChoiceComponent>;

  beforeEach(waitForAsync(() => {
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
