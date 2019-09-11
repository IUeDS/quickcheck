import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtiExportBtnComponent } from './qti-export-btn.component';

describe('QtiExportBtnComponent', () => {
  let component: QtiExportBtnComponent;
  let fixture: ComponentFixture<QtiExportBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtiExportBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtiExportBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
