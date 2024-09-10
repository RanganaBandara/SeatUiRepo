import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Seat } from '../../models/internDashboard.model';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-intern-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './intern-dashboard.component.html',
  styleUrls: ['./intern-dashboard.component.css']
})
export class InternDashboardComponent {

  seats: Seat[] = [];
  selectedDate: Date | null = null;
  filteredSeats: Seat[] = [];
  selectedSeat: Seat | null = null;
  showBookingForm: boolean = false;
  isSubmitting: boolean = false;

  bookingForm: FormGroup;

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService); // Inject AuthService to get user details

  // Assume these values are fetched from the AuthService after login
  employeeName: string | null = null;
  employeeId: string | null = null;

  constructor() {
    this.seats = Array.from({ length: 20 }, (_, i) => ({
      number: i + 1,
      bookings: {},
      isAvailable: true
    }));
    this.filteredSeats = [...this.seats];

    // Get the logged-in user's details from AuthService
    this.employeeName = this.authService.getEmployeeName();
    this.employeeId = this.authService.getEmployeeId();

    // No need to add employeeName and employeeId to the form
    this.bookingForm = new FormGroup({
      // Any other form controls if necessary
    });
  }

  onDateChange() {
    if (this.selectedDate) {
      const selectedDateStr = new Date(this.selectedDate).toDateString();
      this.filteredSeats = this.seats.filter(seat => !seat.bookings[selectedDateStr]);
    } else {
      this.filteredSeats = [...this.seats];
    }
  }

  bookSeat(seat: Seat) {
    this.selectedSeat = seat;
    this.showBookingForm = true;
  }

  submitBooking() {
    this.isSubmitting = true;
    console.log('Submit Booking Button Clicked');

    if (this.bookingForm.valid && this.selectedSeat) {
      const selectedDateStr = new Date(this.selectedDate!).toDateString(); // Use the selected date

      // Prepare the booking data to send to the backend
      const bookingData = {
        EmployeeName: this.employeeName,
        EmployeeId: this.employeeId,
        ReservationDate: selectedDateStr, // Include the date in the booking data
        SeatNumber: this.selectedSeat.number
      };

      // Send the booking data to the backend API
      console.log(bookingData);
      this.http.post('http://localhost:5121/api/Seats/Reserve', bookingData).subscribe({
        next: (response) => {
          console.log('Booking successful:', response);
          alert('Booking confirmed successfully!');

          // Mark the seat as booked locally
          this.selectedSeat!.bookings[selectedDateStr] = true;
          this.onDateChange();
          this.showBookingForm = false;
        },
        error: (error) => {
          console.error('Booking failed:', error);
          alert('Booking failed. Please try again.');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      alert('Please select a seat and a date.');
      this.isSubmitting = false;
    }
  }

  cancelBooking() {
    this.showBookingForm = false;
  }
}