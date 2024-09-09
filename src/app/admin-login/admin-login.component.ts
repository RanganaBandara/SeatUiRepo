import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  loginForm: FormGroup;

  private apiUrl = 'http://localhost:5121/User/Login'; // Update URL if necessary

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router); 
  private notificationService = inject(NotificationService); 

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
 
  onRegister(): void {
    this.router.navigate(['/register']);
  }
  onHome(): void {
    this.router.navigate(['/home']);
  }
  onLogin(): void {
    this.router.navigate(['/admin-dashboard']);
    this.notificationService.showSuccess('Login successful!'); // Show success message
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.login(this.loginForm.value).subscribe(
        response => {
          console.log('Login successful:', response);
          this.onLogin(); // Call onLogin method to navigate and show message
        },
        error => {
          console.error('Login error:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }
}