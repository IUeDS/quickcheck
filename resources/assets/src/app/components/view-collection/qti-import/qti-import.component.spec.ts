import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QtiImportComponent } from './qti-import.component';

describe('QtiImportComponent', () => {
  let component: QtiImportComponent;
  let fixture: ComponentFixture<QtiImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QtiImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QtiImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
