import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDropdownsComponent } from './edit-dropdowns.component';

describe('EditDropdownsComponent', () => {
  let component: EditDropdownsComponent;
  let fixture: ComponentFixture<EditDropdownsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDropdownsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
