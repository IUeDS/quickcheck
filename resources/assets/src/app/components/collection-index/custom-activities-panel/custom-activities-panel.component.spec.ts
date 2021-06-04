import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomActivitiesPanelComponent } from './custom-activities-panel.component';

describe('CustomActivitiesPanelComponent', () => {
  let component: CustomActivitiesPanelComponent;
  let fixture: ComponentFixture<CustomActivitiesPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomActivitiesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomActivitiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
