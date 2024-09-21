import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule,RouterModule]  
})
export class LoginComponent {
  loginForm: FormGroup;

  private apiUrl = 'http://localhost:5121/User/Login'; // Update URL if necessary

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router); 
  private notificationService = inject(NotificationService); 

  constructor() {
    this.loginForm = this.fb.group({
      id: ['',[ Validators.required,Validators.pattern('^[0-9]*$')]],
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
 
  
  
  this.notificationService.showSuccess('Login successful!'); // Show success message
}

onSubmit(): void {
  if (this.loginForm.valid) {
    this.http.post(this.apiUrl,this.loginForm.value).subscribe({
       next: (value) => {

      if(value!=null){
       this.onLogin();
       this.router.navigate(['/intern-dashboard']);

        

        
      }else{
      this.notificationService.showError("Invalid Credentials or register please");
      }
      }
    });
  }
  



}}
