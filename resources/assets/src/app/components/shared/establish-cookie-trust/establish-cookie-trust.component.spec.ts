import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishCookieTrustComponent } from './establish-cookie-trust.component';

describe('EstablishCookieTrustComponent', () => {
  let component: EstablishCookieTrustComponent;
  let fixture: ComponentFixture<EstablishCookieTrustComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishCookieTrustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishCookieTrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
