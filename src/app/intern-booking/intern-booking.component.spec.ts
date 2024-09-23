import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternBookingComponent } from './intern-booking.component';

describe('InternBookingComponent', () => {
  let component: InternBookingComponent;
  let fixture: ComponentFixture<InternBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
