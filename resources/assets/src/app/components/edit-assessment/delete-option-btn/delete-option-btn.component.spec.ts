import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOptionBtnComponent } from './delete-option-btn.component';

describe('DeleteOptionBtnComponent', () => {
  let component: DeleteOptionBtnComponent;
  let fixture: ComponentFixture<DeleteOptionBtnComponent>;

  beforeEach(async(() => {
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
