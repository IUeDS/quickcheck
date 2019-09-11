import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtiImportBtnComponent } from './qti-import-btn.component';

describe('QtiImportBtnComponent', () => {
  let component: QtiImportBtnComponent;
  let fixture: ComponentFixture<QtiImportBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtiImportBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtiImportBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
