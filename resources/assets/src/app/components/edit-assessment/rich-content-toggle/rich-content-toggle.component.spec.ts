import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichContentToggleComponent } from './rich-content-toggle.component';

describe('RichContentToggleComponent', () => {
  let component: RichContentToggleComponent;
  let fixture: ComponentFixture<RichContentToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichContentToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichContentToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
