import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingErrorModalComponent } from './booking-error-modal.component';

describe('BookingErrorModalComponent', () => {
  let component: BookingErrorModalComponent;
  let fixture: ComponentFixture<BookingErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingErrorModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
