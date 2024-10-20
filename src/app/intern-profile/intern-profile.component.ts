// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { RouterModule, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { NavBarHorizontalComponent } from "../nav-bar-horizontal/nav-bar-horizontal.component";

// @Component({
//   selector: 'app-intern-profile',
//   standalone: true,
//   imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule, NavBarHorizontalComponent],
//   templateUrl: './intern-profile.component.html',
//   styleUrls: ['./intern-profile.component.css']
// })
// export class InternProfileComponent implements OnInit {
//   profileForm: FormGroup;
//   isEditMode = false; // Toggle between view and edit mode
//   isEditing = false; // To handle editing state
//   profilePictureUrl: string | ArrayBuffer | null; // URL for the profile picture
//   defaultProfilePic = '../../assets/user.png'; // Path to the default profile picture
//   internName: string = ''; // To hold the intern's name from the API

//   constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
//     // Initialize the profile form
//     this.profileForm = this.fb.group({
//       name: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
//       password: ['', Validators.required],
//       confirmPassword: ['', Validators.required]
//     });
    
//     // Set the default profile picture
//     this.profilePictureUrl = this.defaultProfilePic;
//   }

//   ngOnInit(): void {
//     // Load user profile data from API when the component initializes
//     this.loadUserProfile();
//   }

//   loadUserProfile() {
//     // Replace with your actual API URL to fetch the intern's profile
//     const apiUrl = 'https://your-api-url.com/intern/profile'; // Update this with your actual API endpoint

//     this.http.get<any>(apiUrl).subscribe(
//       (userProfile) => {
//         this.profileForm.patchValue(userProfile); // Load data into the form
//         this.internName = userProfile.name; // Assuming the name field is present in the API response

//         // If the intern has a profile picture, set it; otherwise, keep the default
//         this.profilePictureUrl = userProfile.profilePicture || this.defaultProfilePic; // Update this line based on your API response structure
//       },
//       (error) => {
//         console.error('Error fetching user profile', error);
//       }
//     );
//   }

//   toggleEditMode(): void {
//     this.isEditMode = !this.isEditMode; // Toggle between edit and view mode
//   }

//   enableEdit(): void {
//     this.isEditing = true; // Set editing state to true
//   }

//   saveChanges(): void {
//     if (this.profileForm.valid) {
//       // Handle logic for saving changes here
//       console.log('Profile Updated:', this.profileForm.value);
//       this.isEditing = false; // Set editing state to false after saving
//     }
//   }

//   back(): void {
//     this.router.navigate(['/intern-profile']);
//   }

//   onFileSelected(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.profilePictureUrl = reader.result; // Preview the selected image
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   uploadProfilePicture(): void {
//     // Code to upload the profile picture to the server or handle further logic
//   }

//   dashboard(): void {
//     this.router.navigate(['/intern-dashboard']);
//   }
//   viewProfile() {
//     // Implement logout functionality
//   }
//   changePassword() {
//     // Implement logout functionality
//   }
//   viewBookings(): void {
//     this.router.navigate(['/intern-booking']);
//   }
//   logout(): void {
//     this.router.navigate(['/login']);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarHorizontalComponent } from "../nav-bar-horizontal/nav-bar-horizontal.component";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-intern-profile',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule, NavBarHorizontalComponent],
  templateUrl: './intern-profile.component.html',
  styleUrls: ['./intern-profile.component.css']
})
export class InternProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditMode = false; // Toggle between view and edit mode
  isEditing = false; // To handle editing state
  profilePictureUrl: string | ArrayBuffer | null; // URL for the profile picture
  defaultProfilePic = '../../assets/user.png'; // Path to the default profile picture
  internName: string = ''; // To hold the intern's name from the API
  selectedFile: File | null = null; 
  changesPending: boolean = false; // Track if changes are pending approval

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    // Initialize the profile form
    this.profileForm = this.fb.group({
      traineeId: ['', Validators.required], // Added the traineeId field
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Corrected phone number field name
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    
    // Set the default profile picture
    this.profilePictureUrl = this.defaultProfilePic;
  }

  ngOnInit(): void {
    // Load user profile data from API when the component initializes
    this.loadUserProfile();
  }

  loadUserProfile() {
    const apiUrl = 'https://your-api-url.com/intern/profile'; // Replace with actual API URL

    this.http.get<any>(apiUrl).subscribe(
      (userProfile) => {
        this.profileForm.patchValue({
          traineeId: userProfile.traineeId, 
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone 
        });
        this.internName = userProfile.name; 
        this.profilePictureUrl = userProfile.profilePicture || this.defaultProfilePic;
      },
      (error) => {
        console.error('Error fetching user profile', error);
      }
    );
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode; // Toggle between edit and view mode
  }

  enableEdit(): void {
    this.isEditing = true; // Set editing state to true
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      // Send changes to the server for admin approval
      this.changesPending = true; // Mark changes as pending
      const updatedProfile = { ...this.profileForm.value, changesPending: this.changesPending };
      
      this.http.put('https://your-api-url.com/intern/profile/update', updatedProfile)
        .subscribe(
          (response) => {
            console.log('Changes submitted for admin approval:', response);
            this.isEditing = false; // Set editing state to false after saving
          },
          (error: HttpErrorResponse) => {
            console.error('Error submitting changes:', error);
          }
        );
    }
  }

  back(): void {
    this.router.navigate(['/intern-profile']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', this.selectedFile, this.selectedFile.name);

    this.http.post('https://your-api-url.com/upload-profile-picture', formData)
      .subscribe(
        (response) => {
          console.log('Profile picture uploaded successfully!', response);
        },
        (error: HttpErrorResponse) => {
          console.error('Error uploading profile picture:', error);
        }
      );
  }

  dashboard(): void {
    this.router.navigate(['/intern-dashboard']);
  }

  viewProfile() {
    // Implement profile viewing logic
  }

  changePassword() {
    // Implement change password logic
  }

  viewBookings(): void {
    this.router.navigate(['/intern-booking']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
