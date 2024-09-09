import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingViewComponent } from './admin-booking-view.component';

describe('AdminBookingViewComponent', () => {
  let component: AdminBookingViewComponent;
  let fixture: ComponentFixture<AdminBookingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookingViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminBookingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});