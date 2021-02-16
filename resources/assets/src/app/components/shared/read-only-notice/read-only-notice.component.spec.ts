import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReadOnlyNoticeComponent } from './read-only-notice.component';

describe('ReadOnlyNoticeComponent', () => {
  let component: ReadOnlyNoticeComponent;
  let fixture: ComponentFixture<ReadOnlyNoticeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadOnlyNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadOnlyNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
