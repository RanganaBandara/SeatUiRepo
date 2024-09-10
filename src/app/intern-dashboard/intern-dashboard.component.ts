import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Seat } from '../../models/internDashboard.model';

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

  private http = inject(HttpClient); // Inject HttpClient
  private router = inject(Router); // Inject Router

  constructor() {
    this.seats = Array.from({ length: 20 }, (_, i) => ({
      number: i + 1,
      bookings: {},
      isAvailable: true
    }));
    this.filteredSeats = [...this.seats];

    this.bookingForm = new FormGroup({
      //employeeName: new FormControl('', Validators.required),
      //employeeId: new FormControl('', Validators.required),
      
    });
  }
  
  onDateChange() {
    if (this.selectedDate) {
      const selectedDateStr = new Date(this.selectedDate).toDateString();
      console.log(selectedDateStr);
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
        EmployeeName: this.bookingForm.get('employeeName')?.value,
        EmployeeId: this.bookingForm.get('employeeId')?.value,
        
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
      alert('Please fill out the form correctly.');
      this.isSubmitting = false;
    }
  }
  
  cancelBooking() {
    this.showBookingForm = false;
  }
}