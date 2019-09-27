import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TogglePublicCollectionComponent } from './toggle-public-collection.component';

describe('TogglePublicCollectionComponent', () => {
  let component: TogglePublicCollectionComponent;
  let fixture: ComponentFixture<TogglePublicCollectionComponent>;

  beforeEach(async(() => {
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
