import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAdminComponent } from './invite-admin.component';

describe('InviteAdminComponent', () => {
  let component: InviteAdminComponent;
  let fixture: ComponentFixture<InviteAdminComponent>;

  beforeEach(async(() => {
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
