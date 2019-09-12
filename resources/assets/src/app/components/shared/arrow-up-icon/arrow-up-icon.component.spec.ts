import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowUpIconComponent } from './arrow-up-icon.component';

describe('ArrowUpIconComponent', () => {
  let component: ArrowUpIconComponent;
  let fixture: ComponentFixture<ArrowUpIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrowUpIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrowUpIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
