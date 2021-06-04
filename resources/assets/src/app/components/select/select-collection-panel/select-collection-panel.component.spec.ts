import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectCollectionPanelComponent } from './select-collection-panel.component';

describe('SelectCollectionPanelComponent', () => {
  let component: SelectCollectionPanelComponent;
  let fixture: ComponentFixture<SelectCollectionPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCollectionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCollectionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
