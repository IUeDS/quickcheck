import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QtiImportComponent } from './qti-import.component';

describe('QtiImportComponent', () => {
  let component: QtiImportComponent;
  let fixture: ComponentFixture<QtiImportComponent>;

  beforeEach(waitForAsync(() => {
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
