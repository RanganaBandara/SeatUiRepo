import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  Id:any;
  username:any;
  userid:any;
  name:any;

  bookingForm: FormGroup;

  private http = inject(HttpClient); // Inject HttpClient
  private router = inject(Router); // Inject Router
  
  

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.Id = params['userid'];
      this.userid=this.Id;
      console.log(this.Id);
      this.http.get(`http://localhost:5121/User/User_Id/${this.Id}`).subscribe(     //change url
        (response: any) => {
          if (response && response.name) {
            // Directly assign the name to username
            this.username = response.name;
          } else {
            // Handle the case where the response is null
          }
        },
        error => {
          // Handle any errors here
          console.error('Error fetching user:', error);
        }
      );
    });
  
  
      
     
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
        EmployeeName: this.username,
        User_Id: this.userid,
      
        
        ReservationDate: selectedDateStr, // Include the date in the booking data
        SeatNumber: this.selectedSeat.number
      };
  
      // Send the booking data to the backend API
      
      console.log(bookingData.ReservationDate);
      this.http.post('http://localhost:5121/api/Seats/Reserve', bookingData).subscribe({      //change url
        
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

  logout(): void {
    this.router.navigate(['/login']);
  }

  viewBookings(): void {
    this.router.navigate(['/intern-booking']);
  }
  //navigate to admin dashboard
  dashboard(): void {
    this.router.navigate(['/intern-dashboard/:userid']);
  }
}