import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewIconComponent } from './preview-icon.component';

describe('PreviewIconComponent', () => {
  let component: PreviewIconComponent;
  let fixture: ComponentFixture<PreviewIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
