import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomActivitySelectionComponent } from './custom-activity-selection.component';

describe('CustomActivitySelectionComponent', () => {
  let component: CustomActivitySelectionComponent;
  let fixture: ComponentFixture<CustomActivitySelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomActivitySelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomActivitySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
