import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TogglePublicCollectionComponent } from './toggle-public-collection.component';

describe('TogglePublicCollectionComponent', () => {
  let component: TogglePublicCollectionComponent;
  let fixture: ComponentFixture<TogglePublicCollectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TogglePublicCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TogglePublicCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
