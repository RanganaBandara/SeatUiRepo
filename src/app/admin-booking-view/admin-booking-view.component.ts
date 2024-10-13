import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

interface Booking {
  reservationId: number;
  seatNumber: number;
  user_Id: string;
  employeeName: string;
  reservationDate: string; // Ensure this matches the date format you expect from the API
}

@Component({
  selector: 'app-admin-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './admin-booking-view.component.html',
  styleUrls: ['./admin-booking-view.component.css']
})
export class AdminBookingViewComponent implements OnInit {
  bookingForm: FormGroup;
  bookings: Booking[] = [];
  private apiUrl = 'http://localhost:5121/api/Seats'; // Replace with your actual API endpoint

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef) {
    this.bookingForm = this.fb.group({
      selectedDate: [''] // Form control for selectedDate
    });
  }

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.http.get<Booking[]>(this.apiUrl).subscribe(
      data => {
        this.bookings = data;
        console.log(data);
      },
      error => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  onDateChange(event: any): void {
    const selectedDate = event.value;
  
    if (selectedDate) {
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = selectedDate.toDateString();
  
      console.log(`Selected date: ${formattedDate}`);
  
      const apiUrl = `http://localhost:5121/api/Seats/Filtering/${formattedDate}`;
      console.log(`Calling API with URL: ${apiUrl}`);
  
      this.http.get<Booking>(apiUrl).subscribe(
        data => {
          // Wrap the single booking object in an array
          this.bookings = [data]; // Change from data to [data]
          console.log('Filtered bookings:', this.bookings);
          this.cdr.detectChanges(); // Ensure Angular detects changes
        },
        error => {
          console.error('Error fetching filtered bookings:', error);
        }
      );
    } else {
      this.fetchBookings();
    }
  }
  

 /* cancelBooking(booking: Booking): void {
    const confirmation = confirm(`Are you sure you want to cancel the booking for seat ${booking.seatNumber}?`);
    if (confirmation) {
      this.http.delete(`http://localhost:5121/api/Seats/CancelReservation/${booking.reservationId}`).subscribe(
        () => {
          this.bookings = this.bookings.filter(b => b !== booking);
          alert(`Booking for seat ${booking.seatNumber} has been canceled.`);
        },
        error => {
          console.error('Error canceling booking:', error);
        }
      );
    }
  }*/
    cancelBooking(booking: Booking): void {
      // Parse the reservation date
      const bookingDate = new Date(booking.reservationDate);
      const today = new Date();
    
      // Check if the booking date is in the future
      if (bookingDate < today) {
        alert('Cannot cancel bookings for past dates.');
        return; // Exit the function without performing the cancellation
      }
    
      const confirmation = confirm(`Are you sure you want to cancel the booking for seat ${booking.seatNumber}?`);
      if (confirmation) {
        this.http.delete(`http://localhost:5121/api/Seats/CancelReservation/${booking.reservationId}`).subscribe(
          () => {
            this.bookings = this.bookings.filter(b => b !== booking);
            alert(`Booking for seat ${booking.seatNumber} has been canceled.`);
          },
          error => {
            console.error('Error canceling booking:', error);
          }
        );
      }
    }
    
    isPastBooking(reservationDate: string): boolean {
      const bookingDate = new Date(reservationDate);
      const today = new Date();
      
      // Compare booking date with today's date and return true if booking date is in the past
      return bookingDate < today;
    }
    

  //-------------------------------------------------
  // Logout the user and navigate to the login page
  logout(): void {
    this.router.navigate(['/home']);
  }

  // Navigate to Manage Bookings page
  //managebookings(): void {
    //this.router.navigate(['/admin-booking']);
  //}

  // Navigate to View Booking History page
  viewBookingHistory(): void {
    this.router.navigate(['/admin-history']);
  }

  userManagement(): void {
    this.router.navigate(['/pending']);
  }
  // Navigate to View Bookings page
  viewBookings(): void {
    this.router.navigate(['/admin-booking']);
  }

  attendence(): void {
    this.router.navigate(['/attendance']);
  }
//--------------------------------------------------
}
