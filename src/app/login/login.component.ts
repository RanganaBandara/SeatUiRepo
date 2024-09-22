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
  username:any;
  userid:any;

  private apiUrl = 'http://localhost:5121/User/Login';
   private apiUrl1 = 'http://localhost:5121/User/User_Id';  // Update URL if necessary

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router); 
  private notificationService = inject(NotificationService); 

  constructor() {
    this.loginForm = this.fb.group({
      User_Id: ['',[ Validators.required,Validators.pattern('^[0-9]*$')]],
      Password: ['', Validators.required]
    });
  }
 

onRegister(): void {
  this.router.navigate(['/register']);
}
onHome(): void {
  this.router.navigate(['/home']);
}
onLogin() {
 
  
  
  this.notificationService.showSuccess('Login successful!'); // Show success message
}

onSubmit(){
  const addloginrequest = {
    User_Id: this.loginForm.value. User_Id,
    Password: this.loginForm.value.Password
  };
  if (this.loginForm.valid) {
    this.userid=addloginrequest.User_Id;
    this.http.post('http://localhost:5121/User/Login', addloginrequest).subscribe({
      next: (value) => {
        
       
             
              this.router.navigate(['/intern-dashboard',this.userid])
            }
          })
        }else{
      this.notificationService.showError("Invalid Credentials or register please");
      
      }
      }
    };
  
  




