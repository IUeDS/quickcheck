import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CollectionIndexComponent } from './collection-index.component';

describe('CollectionIndexComponent', () => {
  let component: CollectionIndexComponent;
  let fixture: ComponentFixture<CollectionIndexComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
