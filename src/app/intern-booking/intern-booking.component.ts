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
import { UserService } from '../user.service';

interface Booking {
  reservationId:number;
  seatNumber: number;
  employeeId: string;
  employeeName: string;
  reservationDate: string;
}
@Component({
  selector: 'app-intern-booking',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],
  templateUrl: './intern-booking.component.html',
  styleUrl: './intern-booking.component.css'
})
export class InternBookingComponent  implements OnInit {
  bookingForm: FormGroup;
  bookings: Booking[] = [];
  userId:number|null=null;
  

  private apiUrl = 'https://localhost:7138/api/Seats'; // Replace with your actual API endpoint
  private flturl='https://localhost:7138/api/Seats/Filtering/{dt}';        //change url
  private dlturl='https://localhost:7138/api/Seats/CancelReservation/{id}';    //change url

  

  constructor(private http: HttpClient, private fb: FormBuilder ,private router: Router,private userService: UserService) {
    this.bookingForm = this.fb.group({
      selectedDate: [''] // Form control for selectedDate
    });
  }

  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.fetchBookingHistory(this.userId);

  
  }

  fetchBookingHistory(employeeId:any) {
   
  
      // Send GET request to backend API with employeeId
      this.http.get<any[]>(`http://localhost:5121/api/Seats/rsedeatils/${employeeId}`).subscribe({
        next: (response:any) => {
          console.log('Booking history:', response.details);
          if (response && response.details) {
            this.bookings=response.details;
            // If response is an array
          } else {
            // Assuming the response is a single object, wrap it in an array
            
          }
        },
        error: (error) => {
          console.error('Failed to fetch booking history:', error);
          alert('Failed to retrieve booking history. Please try again.');
        },
      })}

       // Logout the user and navigate to the login page
  logout(): void {
    this.router.navigate(['/home']);
  }
  
  // Navigate to View Bookings page
  viewBookings(): void {
    this.router.navigate(['/intern-booking']);
  }

  //navigate to intern dashboard
  dashboard(): void {
    this.router.navigate(['/intern-dashboard']);
  }

  cancelBooking(booking: Booking): void {
    const confirmation = confirm(`Are you sure you want to cancel the booking for seat ${booking.seatNumber}?`);
    if (confirmation) {
      this.http.delete(`http://localhost:5121/api/Seats/CancelReservation/${booking.reservationId}`).subscribe(      //change url
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


  }
 