/*import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  private router = inject(Router); 
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService); 



  logout(): void {
    this.router.navigate(['/login']);
  }

  managebookings():void{
    this.router.navigate(['/admin-booking'])
  }
}*/

import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],  // Import HttpClientModule here
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  private router = inject(Router); 
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  selectedDate: string = ''; // To hold the selected date
  totalSeats: number = 20; // Default total seats, can be changed based on API response
  bookedSeats: number = 0; // Number of booked seats
  availableSeats: number = 0; // Number of available seats

  constructor() {}
//-------------------------------------------------
  // Logout the user and navigate to the login page
  logout(): void {
    this.router.navigate(['/admin-login']);
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
//--------------------------------------------------
  // Fetch seat data based on the selected date
  onDateChange(event: any): void {
    this.selectedDate = event.target.value; // Get selected date from date picker
    this.fetchSeatInfo(this.selectedDate).subscribe(
      (seatData: any) => {
        console.log(seatData);
        seatData=parseInt(seatData);
        this.bookedSeats = seatData;
        this.availableSeats = this.totalSeats - this.bookedSeats;
      },
      (error) => {
        this.notificationService.showError('Error fetching seat information');
      }
    );
  }

  // API call to fetch seat information for the selected date
  fetchSeatInfo(date: string): Observable<any> {
    const url = `http://localhost:5121/api/Seats/count/10`;
    return this.http.get(url);
  }
}
