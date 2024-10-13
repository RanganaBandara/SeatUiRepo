import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Seat } from '../../models/internDashboard.model';
import { UserService } from '../user.service';
import { event } from 'jquery';
import { BookingErrorModalComponent } from '../booking-error-modal/booking-error-modal.component';
//import { BookingSucessModalComponent } from '../booking-sucess-modal/booking-sucess-modal.component';
import { NavBarHorizontalComponent } from '../nav-bar-horizontal/nav-bar-horizontal.component';
@Component({
  selector: 'app-intern-dashboard',
  standalone: true,
  imports: [CommonModule,
            FormsModule, 
            ReactiveFormsModule,
            HttpClientModule,
            BookingErrorModalComponent,
            NavBarHorizontalComponent],
  templateUrl: './intern-dashboard.component.html',
  styleUrls: ['./intern-dashboard.component.css']
})
export class InternDashboardComponent implements OnInit {
  minDate: string;
  minDate: String;
  seatnumbertdetails:any;
  seatNumber:number|null=null;
  seats: Seat[] = [];
  selectedDate: Date | null = null;
  filteredSeats: Seat[] = [];
  selectedSeat: number | null = null;
  showBookingForm: boolean = false;
  isSubmitting: boolean = false;
  userId: number | null = null; // Ensure it's initialized
  username: string | null = null; // Change to appropriate type
  bookingForm: FormGroup;
 
  seatNumbers: Seat[]=[];

  //errorMessage: string | null = null; // Add errorMessage property
  //sucessMessage: string | null = null; // Add errorMessage property

  private http = inject(HttpClient); // Inject HttpClient
  private router = inject(Router); // Inject Router
  private userService = inject(UserService); // Inject UserService

  constructor(private route: ActivatedRoute) {
    // Initialize booking form here if needed
    this.bookingForm = new FormGroup({});
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    // Format to YYYY-MM-DD
  }

  ngOnInit() {



    // Get the user ID from UserService
    this.userId = this.userService.getUserId();
    this.initializeSeats();
    
    

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
   
  }

  initializeSeats(): void {
    this.http.get<Seat[]>(`http://localhost:5121/api/Seats/fetchseats`).subscribe({
      next: (response:any) => {
        console.log('Initial Seats:', response); // Log the initial response
        this.seats = response.seatDetails.result; // Assign to seats
        this.seatNumbers = this.seats; // Set seatNumbers directly for now
        console.log('Seat Numbers:', this.seatNumbers); // Log to check
      },
      error: (error) => {
        console.error('Error fetching seats:', error);
      }
    });
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
      console.log(selectedDateStr);
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = new Date(selectedDateStr).toLocaleDateString('en-US', options).replace(/,/g, '');
  
    
      
      this.http.get<Seat[]>(`http://localhost:5121/api/Seats/getseatnumbers/${selectedDateStr}`).subscribe({
        next: (response:any) => {
          console.log('API Response:', response); // Log the response to check structure
          this.seats = response.seatnumbertdetails; // Assuming response is an array of Seat objects
          this.seatNumbers = this.seats; // Filter available seats
          console.log('Filtered Seat Numbers:', this.seatNumbers); // Check filtered results
        },
        error: (error) => {
          console.error('Error fetching seats for selected date:', error);
        }
      });
    
  }
  
}
  
  bookSeat(seat:any) {
    this.selectedSeat = seat;
    this.showBookingForm = true;
  }

  submitBooking() {
    this.isSubmitting = true;
  
    if (this.bookingForm.valid && this.selectedSeat && this.selectedDate) {
      const selectedDateStr = new Date(this.selectedDate).toDateString();
  
      // Check if the seat is already booked for the selected date
     
  
      // Proceed with booking submission if the seat is available
      const bookingData = {
        EmployeeName: this.username,
        User_Id: this.userId,
        ReservationDate: selectedDateStr,
        SeatNumber: this.selectedSeat
      };
  
      this.http.post('http://localhost:5121/api/Seats/Reserve', bookingData).subscribe({
        next: (response) => {
          console.log('Booking successful:', response);
          alert('Booking confirmed successfully!');
          //this.sucessMessage = 'Your booking was successful!'; // Set the success message
          

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
    } else 
    // {
    //   this.errorMessage = 'Please fill out the form correctly.'; // Set the error message
    //   this.isSubmitting = false; // Reset the submitting state
    // }
    {
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

  viewProfile(): void {
    this.router.navigate(['/intern-profile']);
  }
}