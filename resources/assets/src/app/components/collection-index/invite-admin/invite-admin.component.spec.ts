import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InviteAdminComponent } from './invite-admin.component';

describe('InviteAdminComponent', () => {
  let component: InviteAdminComponent;
  let fixture: ComponentFixture<InviteAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
