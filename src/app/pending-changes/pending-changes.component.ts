import { Component ,inject} from '@angular/core';
import {  OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pending-changes',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './pending-changes.component.html',
  styleUrl: './pending-changes.component.css'
})
export class PendingChangesComponent implements OnInit {
  pendingChanges: any[] = []; // Array to hold pending changes

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPendingChanges(); // Fetch pending changes on initialization
  }

  private router = inject(Router); 

  fetchPendingChanges() {
    const apiUrl = 'https://your-api-url.com/admin/pending-changes'; // Replace with actual API URL
    this.http.get<any[]>(apiUrl).subscribe(
      (changes) => {
        this.pendingChanges = changes; // Store fetched changes
      },
      (error) => {
        console.error('Error fetching pending changes:', error);
      }
    );
  }

  approveChange(changeId: number) {
    const apiUrl = `https://your-api-url.com/admin/approve-change/${changeId}`; // Replace with actual API URL
    this.http.post(apiUrl, {}).subscribe(
      () => {
        this.fetchPendingChanges(); // Refresh pending changes after approval
      },
      (error) => {
        console.error('Error approving change:', error);
      }
    );
  }

  rejectChange(changeId: number) {
    const apiUrl = `https://your-api-url.com/admin/reject-change/${changeId}`; // Replace with actual API URL
    this.http.post(apiUrl, {}).subscribe(
      () => {
        this.fetchPendingChanges(); // Refresh pending changes after rejection
      },
      (error) => {
        console.error('Error rejecting change:', error);
      }
    );
  }
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

  userManagement(): void {
    this.router.navigate(['/pending']);
  }
  // Navigate to View Bookings page
  viewBookings(): void {
    this.router.navigate(['/admin-booking']);
  }

  attendence(): void {
    this.router.navigate(['/attendance']);
  }
}
