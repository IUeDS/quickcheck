import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomActivitySelectionComponent } from './custom-activity-selection.component';

describe('CustomActivitySelectionComponent', () => {
  let component: CustomActivitySelectionComponent;
  let fixture: ComponentFixture<CustomActivitySelectionComponent>;

  beforeEach(waitForAsync(() => {
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
