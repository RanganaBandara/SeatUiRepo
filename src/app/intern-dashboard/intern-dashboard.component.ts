import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Seat } from '../../models/internDashboard.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-intern-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './intern-dashboard.component.html',
  styleUrls: ['./intern-dashboard.component.css']
})
export class InternDashboardComponent implements OnInit {
  
  seats: Seat[] = [];
  selectedDate: Date | null = null;
  filteredSeats: Seat[] = [];
  selectedSeat: Seat | null = null;
  showBookingForm: boolean = false;
  isSubmitting: boolean = false;
  userId: number | null = null; // Ensure it's initialized
  username: string | null = null; // Change to appropriate type
  bookingForm: FormGroup;

  private http = inject(HttpClient); // Inject HttpClient
  private router = inject(Router); // Inject Router
  private userService = inject(UserService); // Inject UserService

  constructor(private route: ActivatedRoute) {
    // Initialize booking form here if needed
    this.bookingForm = new FormGroup({});
  }

  ngOnInit() {
    // Get the user ID from UserService
    this.userId = this.userService.getUserId();

    // Log the user ID to check if it's retrieved correctly
    console.log('User ID in Dashboard:', this.userId);

    if (this.userId !== null) {
      // Make the API call to fetch user details using the user ID
      this.http.get(`http://localhost:5121/User/User_Id/${this.userId}`).subscribe(
        (response: any) => {
          if (response && response.name) {
            this.username = response.name; // Assign username from the response
          } else {
            console.error('User response is null or malformed:', response);
          }
        },
        error => {
          console.error('Error fetching user:', error);
        }
      );
    } else {
      console.error('User ID is null. Ensure the user is logged in.');
    }

    // Initialize seats
    this.seats = Array.from({ length: 20 }, (_, i) => ({
      number: i + 1,
      bookings: {},
      isAvailable: true
    }));
    this.filteredSeats = [...this.seats];
  }

  // onDateChange() {
  //   if (this.selectedDate) {
  //     const selectedDateStr = new Date(this.selectedDate).toDateString();
  //     this.filteredSeats = this.seats.filter(seat => !seat.bookings[selectedDateStr]);
  //   } else {
  //     this.filteredSeats = [...this.seats];
  //   }
  // }
  
  onDateChange() {
    if (this.selectedDate) {
      const selectedDateStr = new Date(this.selectedDate).toDateString();
  
      // Filter seats based on whether they are booked for the selected date
      this.filteredSeats = this.seats.map(seat => {
        return {
          ...seat,
          isAvailable: !seat.bookings[selectedDateStr] // If seat has booking for the date, mark as unavailable
        };
      });
    } else {
      this.filteredSeats = [...this.seats]; // Reset to all seats if no date is selected
    }
  }
  
  bookSeat(seat: Seat) {
    this.selectedSeat = seat;
    this.showBookingForm = true;
  }

  submitBooking() {
    this.isSubmitting = true;
  
    if (this.bookingForm.valid && this.selectedSeat && this.selectedDate) {
      const selectedDateStr = new Date(this.selectedDate).toDateString();
  
      // Check if the seat is already booked for the selected date
      if (this.selectedSeat.bookings[selectedDateStr]) {
        alert('This seat is already booked for the selected date.');
        this.isSubmitting = false;
        return; // Prevent further submission if the seat is already booked
      }
  
      // Proceed with booking submission if the seat is available
      const bookingData = {
        EmployeeName: this.username,
        User_Id: this.userId,
        ReservationDate: selectedDateStr,
        SeatNumber: this.selectedSeat.number
      };
  
      this.http.post('http://localhost:5121/api/Seats/Reserve', bookingData).subscribe({
        next: (response) => {
          console.log('Booking successful:', response);
          alert('Booking confirmed successfully!');
          this.selectedSeat!.bookings[selectedDateStr] = true; // Mark the seat as booked for the selected date
          this.onDateChange(); // Refresh seat availability
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
  
  // submitBooking() {
  //   this.isSubmitting = true;

  //   if (this.bookingForm.valid && this.selectedSeat) {
  //     const selectedDateStr = new Date(this.selectedDate!).toDateString();
  //     const bookingData = {
  //       EmployeeName: this.username,
  //       User_Id: this.userId, // Use the userId variable directly
  //       ReservationDate: selectedDateStr,
  //       SeatNumber: this.selectedSeat.number
  //     };

  //     this.http.post('http://localhost:5121/api/Seats/Reserve', bookingData).subscribe({
  //       next: (response) => {
  //         console.log('Booking successful:', response);
  //         alert('Booking confirmed successfully!');
  //         this.selectedSeat!.bookings[selectedDateStr] = true;
  //         this.onDateChange();
  //         this.showBookingForm = false;
  //       },
  //       error: (error) => {
  //         console.error('Booking failed:', error);
  //         alert('Booking failed. Please try again.');
  //       },
  //       complete: () => {
  //         this.isSubmitting = false;
  //       }
  //     });
  //   } else {
  //     alert('Please fill out the form correctly.');
  //     this.isSubmitting = false;
  //   }
  // }

  cancelBooking() {
    this.showBookingForm = false;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  viewBookings(): void {
    this.router.navigate(['/intern-booking']);
  }

  dashboard(): void {
    this.router.navigate(['/intern-dashboard']);
  }
}
