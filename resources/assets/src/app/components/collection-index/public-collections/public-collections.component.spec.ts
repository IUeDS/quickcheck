import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublicCollectionsComponent } from './public-collections.component';

describe('PublicCollectionsComponent', () => {
  let component: PublicCollectionsComponent;
  let fixture: ComponentFixture<PublicCollectionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicCollectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
