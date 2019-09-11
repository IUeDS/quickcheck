import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtiExportComponent } from './qti-export.component';

describe('QtiExportComponent', () => {
  let component: QtiExportComponent;
  let fixture: ComponentFixture<QtiExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtiExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtiExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
