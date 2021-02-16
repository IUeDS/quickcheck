import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompletionModalComponent } from './completion-modal.component';

describe('CompletionModalComponent', () => {
  let component: CompletionModalComponent;
  let fixture: ComponentFixture<CompletionModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
