import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTextmatchComponent } from './edit-textmatch.component';

describe('EditTextmatchComponent', () => {
  let component: EditTextmatchComponent;
  let fixture: ComponentFixture<EditTextmatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTextmatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTextmatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
