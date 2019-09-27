import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMatchingComponent } from './edit-matching.component';

describe('EditMatchingComponent', () => {
  let component: EditMatchingComponent;
  let fixture: ComponentFixture<EditMatchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
