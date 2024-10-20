import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  showAdminForm = false;
  showInternForm = false;
  private router = inject(Router); 
  // Function to toggle the forms based on selection
  showForm(event: any) {
    const userType = event.target.value;
    this.showAdminForm = (userType === 'admin');
    this.showInternForm = (userType === 'intern');
  }

  dashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  viewBookings(): void {
    this.router.navigate(['/admin-booking']);
  }

  viewBookingHistory(): void {
    this.router.navigate(['/admin-history']);
  }

  logout(): void {
    this.router.navigate(['/home']);
  }
}

