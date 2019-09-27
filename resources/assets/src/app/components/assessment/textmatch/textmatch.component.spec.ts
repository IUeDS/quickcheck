import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextmatchComponent } from './textmatch.component';

describe('TextmatchComponent', () => {
  let component: TextmatchComponent;
  let fixture: ComponentFixture<TextmatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextmatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextmatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
