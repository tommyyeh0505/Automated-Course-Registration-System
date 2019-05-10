import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitlistDetailComponent } from './waitlist-detail.component';

describe('WaitlistDetailComponent', () => {
  let component: WaitlistDetailComponent;
  let fixture: ComponentFixture<WaitlistDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitlistDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitlistDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
