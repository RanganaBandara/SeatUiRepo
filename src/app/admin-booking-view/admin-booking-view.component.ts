import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { data, event } from 'jquery';
import { Router } from '@angular/router';

interface Booking {
  reservationId:number;
  seatNumber: number;
  user_Id: string;
  employeeName: string;
  reservationDate: string;
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
  private flturl='http://localhost:5121/api/Seats/Filtering/{dt}';
  private dlturl='http://localhost:5121/api/Seats/CancelReservation/{id}';

  

  constructor(private http: HttpClient, private fb: FormBuilder ,private router: Router) {
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
    const selectedDateStr = new Date(selectedDate).toDateString();
     // Make sure you're accessing the correct property here
     console.log(selectedDateStr);
    if (selectedDateStr!=null) {
      
      this.http.get<Booking[]>(`http://localhost:5121/api/Seats/Filtering/${selectedDateStr}`).subscribe(
        data => {
          this.bookings = data;
          console.log(data);
          
        },
        error => {
          console.error('Error fetching bookings:', error);
        }
      );
    } else {
      this.fetchBookings();
    }
  }


  cancelBooking(booking: Booking): void {
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

  //onSubmit(): void {
    // You can use this method to submit the form data if needed
   // const formData = this.bookingForm.value;
   // console.log('Form submitted with data:', formData);
    // Send formData to your backend or handle it accordingly
  //}
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

  // Navigate to View Bookings page
  viewBookings(): void {
    this.router.navigate(['/admin-booking']);
  }
  //navigate to admin dashboard
  dashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }
//--------------------------------------------------
}