import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './admin-history.component.html',
  styleUrls: ['./admin-history.component.css']
})
export class AdminHistoryComponent {
  bookingHistoryForm: FormGroup;
  employeeBookings: any[] = []; // Store fetched booking data here
  isLoading: boolean = false;
  details:any;

  // Inject the HttpClient for making HTTP requests
  private http = inject(HttpClient);
  private router = inject(Router); // Inject Router for navigation
  constructor() {
    this.bookingHistoryForm = new FormGroup({
      employeeId: new FormControl('', [Validators.required]) // Employee ID input field
    });




    
  }

  // Method to fetch booking history from the backend API
  /*fetchBookingHistory() {
    if (this.bookingHistoryForm.valid) {
      const employeeId = this.bookingHistoryForm.get('employeeId')?.value;
      this.isLoading = true;

      // Send GET request to backend API with employeeId
      this.http.get<any[]>(`http://localhost:5121/api/Seats/rsedeatils/${employeeId}`).subscribe({
        next: (response) => {
          console.log('Booking history:', response);
          this.employeeBookings = response; // Store the fetched booking history in the component
        },
        error: (error) => {
          console.error('Failed to fetch booking history:', error);
          alert('Failed to retrieve booking history. Please try again.');
        },
        complete: () => {
          this.isLoading = false; // Set loading state to false once the data is received
        }
      });
    } else {
      alert('Please enter a valid Employee ID.');
    }
  }*/
    fetchBookingHistory() {
      if (this.bookingHistoryForm.valid) {
        const employeeId = this.bookingHistoryForm.get('employeeId')?.value;
        this.isLoading = true;
    
        // Send GET request to backend API with employeeId
        this.http.get<any[]>(`http://localhost:5121/api/Seats/rsedeatils/${employeeId}`).subscribe({
          next: (response:any) => {
            console.log('Booking history:', response.details);
            if (response && response.details) {
              this.employeeBookings = response.details; // If response is an array
            } else {
              // Assuming the response is a single object, wrap it in an array
              this.employeeBookings = [response];
            }
          },
          error: (error) => {
            console.error('Failed to fetch booking history:', error);
            alert('Failed to retrieve booking history. Please try again.');
          },
          complete: () => {
            this.isLoading = false; // Set loading state to false once the data is received
          }
        });
      } else {
        alert('Please enter a valid Employee ID.');
      }
    }
    




// Method to navigate to the bookings page
viewBookings() {
  this.router.navigate(['/admin-booking']);
}

// Method to navigate to the booking history page
viewBookingHistory() {
  this.router.navigate(['/admin-history']); 
}

  logout() {
    // Clear session or perform logout actions
    console.log('Logging out');
    this.router.navigate(['/admin-login']); 
  }
  //dashboard
  //navigate to admin dashboard
  dashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
