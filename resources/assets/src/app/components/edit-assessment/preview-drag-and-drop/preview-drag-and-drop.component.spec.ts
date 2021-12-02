import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDragAndDropComponent } from './preview-drag-and-drop.component';

describe('PreviewDragAndDropComponent', () => {
  let component: PreviewDragAndDropComponent;
  let fixture: ComponentFixture<PreviewDragAndDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDragAndDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDragAndDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
