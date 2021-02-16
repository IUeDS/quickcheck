import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewAllCollectionsToggleComponent } from './view-all-collections-toggle.component';

describe('ViewAllCollectionsToggleComponent', () => {
  let component: ViewAllCollectionsToggleComponent;
  let fixture: ComponentFixture<ViewAllCollectionsToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllCollectionsToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllCollectionsToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
