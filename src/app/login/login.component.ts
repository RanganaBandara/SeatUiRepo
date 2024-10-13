import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../user.service';

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

  private apiUrl = 'http://localhost:5121/User/Login';      //change url 
   private apiUrl1 = 'http://localhost:5121/User/User_Id';  //change url

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router); 
  private notificationService = inject(NotificationService); 

  constructor(private userService: UserService) {
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
 
  
  
 // this.notificationService.showSuccess('Login successful!'); // Show success message
}

onSubmit(){
  const addloginrequest = {
    User_Id: this.loginForm.value. User_Id,
    Password: this.loginForm.value.Password
    
    
  };
  this.userService.setUserId(addloginrequest.User_Id);
  if (this.loginForm.valid) {
    this.userid=addloginrequest.User_Id;
    this.http.post('http://localhost:5121/User/login', addloginrequest).subscribe({           //change url
      next: (value) => {

        console.log(value);
        if(value!=null){
          this.router.navigate(['/intern-dashboard'])
       

        }else{
        this.notificationService.showError("Invalid Credentials or register please");
        }    
            }
          })
        }
      }


///////////////////new//////////////////////new///////
loginWithFacebook(): void {
  window.FB.login((response: any) => {
    if (response.authResponse) {
      const accessToken = response.authResponse.accessToken;

      // Send the access token to the backend
      this.http.post('https://your-backend-api.com/api/facebook-login', { token: accessToken })
        .subscribe(response => {
          console.log('Login successful!', response);
          // Handle login success (e.g., store the JWT in localStorage)
        });
    } else {
      console.log('User cancelled login or did not fully authorize.');
    }
  }, { scope: 'email' });
}


sendTokenToBackend(token: string): void {
  this.http.post('https://localhost:5121/api/auth/facebook-login', { accessToken: token })
    .subscribe({
      next: (response: any) => {
        // Handle response, typically save the JWT token in local storage
        const jwtToken = response.token;
        localStorage.setItem('token', jwtToken);
        this.router.navigate(['/intern-dashboard']);  // Redirect to the dashboard
      },
      error: (error) => {
        this.notificationService.showError('Facebook login failed.');
        console.error('Error during Facebook login:', error);
      }
    });
}
////////////////////////////



    };
  
  