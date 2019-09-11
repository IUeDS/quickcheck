import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyNoticeComponent } from './read-only-notice.component';

describe('ReadOnlyNoticeComponent', () => {
  let component: ReadOnlyNoticeComponent;
  let fixture: ComponentFixture<ReadOnlyNoticeComponent>;

  beforeEach(async(() => {
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
