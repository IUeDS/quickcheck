import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteOptionBtnComponent } from './delete-option-btn.component';

describe('DeleteOptionBtnComponent', () => {
  let component: DeleteOptionBtnComponent;
  let fixture: ComponentFixture<DeleteOptionBtnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteOptionBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteOptionBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
