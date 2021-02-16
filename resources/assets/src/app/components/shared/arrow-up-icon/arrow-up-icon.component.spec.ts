import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArrowUpIconComponent } from './arrow-up-icon.component';

describe('ArrowUpIconComponent', () => {
  let component: ArrowUpIconComponent;
  let fixture: ComponentFixture<ArrowUpIconComponent>;

  beforeEach(waitForAsync(() => {
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
