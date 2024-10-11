import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReasonDialogComponent } from '../reason-dialog/reason-dialog.component';
import { Attendence } from '../../models/attendance.model';

interface Booking {
  reservationId: number;
  seatNumber: number;
  user_Id: number; // Ensure this is defined as a number
  employeeName: string;
  reservationDate: string;
  attendanceMarked: boolean;
}

@Component({
  selector: 'app-attendance-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './attendance-management.component.html',
  styleUrls: ['./attendance-management.component.css']
})
export class AttendanceManagementComponent implements OnInit {
  attendanceApiUrl = 'http://localhost:5121/api/Seats/Attendence';
  bookings: Booking[] = [];
  markedAttendances: Booking[] = [];
  isAdmin: boolean = false;
  showAdvancedSettings: boolean = false;

  private router = inject(Router);

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit() {
    this.fetchBookings();
    this.checkAdminStatus();
    this.fetchMarkedAttendances();
  }

  fetchBookings() {
    const bookingsApiUrl = 'http://localhost:5121/api/Seats';
    this.http.get<Booking[]>(bookingsApiUrl).subscribe({
      next: (response) => {
        this.bookings = response;
        console.log('Fetched bookings:', this.bookings);
      },
      error: (error) => console.error('Error fetching bookings:', error),
    });
  }

  fetchMarkedAttendances() {
    const markedAttendancesApiUrl = 'http://localhost:5121/api/Seats/MarkedAttendances';
    this.http.get<Booking[]>(markedAttendancesApiUrl).subscribe({
      next: (response) => this.markedAttendances = response,
      error: (error) => console.error('Error fetching marked attendances:', error),
    });
  }

  checkAdminStatus() {
    this.isAdmin = true; // Set this based on your logic
  }

  markAttendance(reservationId: number, isPresent: boolean, userId: number, employeeName: string, reason?: string) {
    const attendance: Attendence = {
      Id: 0, // Set to 0 if you're creating a new record
      User_Id: userId,
      Name: employeeName,
      Date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      PRAb: isPresent,
      Reason: isPresent ? '' : reason // Pass the reason if absent
    };
  
    this.http.post('http://localhost:5121/api/Seats/Attendence', attendance)
      .subscribe(
        response => {
          console.log('Attendance marked successfully:', response);
          // Remove the marked booking from the bookings array
          this.bookings = this.bookings.filter(booking => booking.reservationId !== reservationId);
        },
        error => {
          console.error('Error marking attendance:', error);
        }
      );
  }
  

  promptReason(reservationId: number) {
    const dialogRef = this.dialog.open(ReasonDialogComponent, { data: { reservationId } });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) { // result should contain the reason for absence
        const booking = this.bookings.find(b => b.reservationId === reservationId);
        if (booking) {
          // Pass the reason to markAttendance method
          this.markAttendance(reservationId, false, booking.user_Id, booking.employeeName, result);
        }
      }
    });
  }
  

  toggleAdvancedSettings() {
    this.showAdvancedSettings = !this.showAdvancedSettings;
  }

  correctAttendance(reservationId: number, isPresent: boolean) {
    const booking = this.bookings.find(b => b.reservationId === reservationId);
    if (booking) {
      this.markAttendance(reservationId, isPresent, booking.user_Id, booking.employeeName);
    }
  }
  
  deleteAttendance(reservationId: number) {
    const deleteUrl = `${this.attendanceApiUrl}/${reservationId}`;
    this.http.delete(deleteUrl).subscribe({
      next: () => {
        console.log(`Deleted attendance for reservation ID: ${reservationId}`);
        this.markedAttendances = this.markedAttendances.filter(b => b.reservationId !== reservationId);
      },
      error: (error) => console.error('Error deleting attendance:', error)
    });
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
//--------------------------------------------------
}
