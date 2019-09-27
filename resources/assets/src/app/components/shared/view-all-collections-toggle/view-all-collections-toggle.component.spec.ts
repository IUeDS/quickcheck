import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllCollectionsToggleComponent } from './view-all-collections-toggle.component';

describe('ViewAllCollectionsToggleComponent', () => {
  let component: ViewAllCollectionsToggleComponent;
  let fixture: ComponentFixture<ViewAllCollectionsToggleComponent>;

  beforeEach(async(() => {
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
