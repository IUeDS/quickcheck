import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDragAndDropComponent } from './edit-drag-and-drop.component';

describe('EditDragAndDropComponent', () => {
  let component: EditDragAndDropComponent;
  let fixture: ComponentFixture<EditDragAndDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDragAndDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDragAndDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
