import { Component, inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../user.service';




//import {firebaseConfig} from '../../firebase.config';
import {  AfterViewInit } from '@angular/core';


declare global {
  interface Window {
    google: any;
  }
}




@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule,RouterModule,]  
})
export class LoginComponent implements AfterViewInit {
  loginForm: FormGroup;
  username:any;
  userid:any;
  email:any;

  private apiUrl = 'http://localhost:5121/User/Login';      //change url 
   private apiUrl1 = 'http://localhost:5121/User/User_Id';  //change url

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router); 
  private notificationService = inject(NotificationService); 
  private userService = inject(UserService); 
  private ngZone = inject(NgZone);

  constructor() {
    this.loginForm = this.fb.group({
      User_Id: ['',[ Validators.required,Validators.pattern('^[0-9]*$')]],
      Password: ['', Validators.required]
    

    });
  }
 
   // Define the missing handleCredentialResponse method
   handleCredentialResponse(response: any) {
    console.log("Encoded JWT ID token: " + response.credential);
    const credential = response.credential;
    const payload = this.parseJwt(credential);
    
    // Get the user's email
    const Email = payload.email;
    console.log('User email:', Email);
   
    this.sendTokenToBackend(response.credential);
    this.idfromemail(Email);
    
  }
  idfromemail(Email:string){
    this.http.get(`http://localhost:5121/User/${Email}`).subscribe({           //change url
      next: (response: any) => {
        console.log(response.user_Id);
        this.email=response.user_Id;
        this.userService.setUserId=this.email;
        console.log(this.userService.getUserId());
        
       
  }})}

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  }
  ngAfterViewInit(): void {
    if (window.google) {
      this.userService.setUserId(10);
      console.log("Google script loaded successfully.");
      window.google.accounts.id.initialize({
        client_id: "216245630815-13t966f7v62lkmkkgeehov52tgqdqjo7.apps.googleusercontent.com",
        callback: this.handleCredentialResponse.bind(this)
      });
  
      window.google.accounts.id.renderButton(
        document.getElementById("g_id_onload"),
        { theme: "outline", size: "large" }
      );
    } else {
      console.error("Google script did not load.");
    }
  }
  sendTokenToBackend(IdToken: string): void {
    console.log(IdToken);
    this.http.post('http://localhost:5121/api/Auth/google', { IdToken })
    
      .subscribe({
        next: (response: any) => {
         
          const jwtToken = response.Token;
          localStorage.setItem('token', jwtToken);
          console.log("google token",response);
          
          this.ngZone.run(() => {
            this.router.navigate(['/intern-dashboard']); // Navigate to the next page
          });
        },
        error: (error) => {
          this.notificationService.showError('Google login failed.');
          console.error('Error during Google login:', error);
        }
      });
  }


  /////////

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
//////////////////////new///////////////////////
// loginWithGoogle(): void {
//   GoogleLogin({
//     onSuccess: (response) => {
//       console.log('Login successful!', response);
//       const token = response.credential;
//       this.sendTokenToBackend(token);
//     },
//     onError: () => {
//       this.notificationService.showError('Google login failed.');
//     },
//   });
// }
// loginWithGoogle(): void {
//   GoogleLogin({
//     onSuccess: (response) => {
//       console.log('Login successful!', response);
//       const token = response.credential;
//       if (token) {
//         this.sendTokenToBackend(token);
//       } else {
//         this.notificationService.showError('Google login did not return a token.');
//       }
//     },
//     onError: () => {
//       this.notificationService.showError('Google login failed.');
//     },
//   });
// }


// sendTokenToBackendGoogle(token: string): void {
//   this.http.post('https://localhost:5121/api/auth/google-login', { token })
//     .subscribe({
//       next: (response: any) => {
//         const jwtToken = response.token;
//         localStorage.setItem('token', jwtToken);
//         this.router.navigate(['/intern-dashboard']);
//       },
//       error: () => {
//         this.notificationService.showError('Google login failed.');
//       }
//     });
// }

///////////////////new//////////////////////new///////
// loginWithFacebook(): void {
//   window.FB.login((response: any) => {
//     if (response.authResponse) {
//       const accessToken = response.authResponse.accessToken;

//       // Send the access token to the backend
//       this.http.post('https://your-backend-api.com/api/facebook-login', { token: accessToken })
//         .subscribe(response => {
//           console.log('Login successful!', response);
//           // Handle login success (e.g., store the JWT in localStorage)
//         });
//     } else {
//       console.log('User cancelled login or did not fully authorize.');
//     }
//   }, { scope: 'email' });
// }


// sendTokenToBackend(token: string): void {
//   this.http.post('https://localhost:5121/api/auth/facebook-login', { accessToken: token })
//     .subscribe({
//       next: (response: any) => {
//         // Handle response, typically save the JWT token in local storage
//         const jwtToken = response.token;
//         localStorage.setItem('token', jwtToken);
//         this.router.navigate(['/intern-dashboard']);  // Redirect to the dashboard
//       },
//       error: (error) => {
//         this.notificationService.showError('Facebook login failed.');
//         console.error('Error during Facebook login:', error);
//       }
//     });
// }
////////////////////////////



    };