import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomActivityComponent } from './custom-activity.component';

describe('CustomActivityComponent', () => {
  let component: CustomActivityComponent;
  let fixture: ComponentFixture<CustomActivityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
