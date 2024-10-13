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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { event } from 'jquery';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],  // Import HttpClientModule here
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  private router = inject(Router); 
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  selectedDateStr:string='';
  selectedDate: string = ''; // To hold the selected date
  totalSeats: number = 20; // Default total seats, can be changed based on API response
  bookedSeats: number = 0; // Number of booked seats
  availableSeats: number = 0; // Number of available seats
  cnt:any;

  constructor() {}
  ngOnInit(): void {
    this.onDateChange(event);
  
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

  //message with admin/intern
message(){
  this.router.navigate(['/message']);    
}


  // Navigate to View Bookings page
  viewBookings(): void {
    this.router.navigate(['/admin-booking']);
  }
//--------------------------------------------------
  // Fetch seat data based on the selected date
  onDateChange(event: any): void {
    const selectedDate = event.value;
    const selectedDateStr = new Date(selectedDate).toDateString(); // Get selected date from date picker
    console.log(selectedDateStr);
    this.fetchSeatInfo(selectedDateStr).subscribe(
      (response: any) => {
        if (response && response.cnt) {
        console.log(response.cnt);
        const seatData=parseInt(response.cnt);
        this.bookedSeats = seatData;
        this.availableSeats = this.totalSeats - this.bookedSeats;
        console.log(this.availableSeats);
       } 
      else{
        this.availableSeats=20;
        this.bookedSeats=0;
        this.totalSeats=20;
      }},
      (error) => {
        this.notificationService.showError('Error fetching seat information');
      }
    );
  }

  // API call to fetch seat information for the selected date
  fetchSeatInfo(date: string): Observable<any> {
    const url = `http://localhost:5121/api/Seats/count/${date}`;
    return this.http.get(url);
  }
}