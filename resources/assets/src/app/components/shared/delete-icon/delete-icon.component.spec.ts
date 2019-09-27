import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIconComponent } from './delete-icon.component';

describe('DeleteIconComponent', () => {
  let component: DeleteIconComponent;
  let fixture: ComponentFixture<DeleteIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
