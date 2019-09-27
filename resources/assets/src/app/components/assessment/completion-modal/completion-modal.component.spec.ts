import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletionModalComponent } from './completion-modal.component';

describe('CompletionModalComponent', () => {
  let component: CompletionModalComponent;
  let fixture: ComponentFixture<CompletionModalComponent>;

  beforeEach(async(() => {
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
