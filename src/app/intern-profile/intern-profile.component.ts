import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intern-profile',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule],
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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    // Initialize the profile form
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
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
    // Replace with your actual API URL to fetch the intern's profile
    const apiUrl = 'https://your-api-url.com/intern/profile'; // Update this with your actual API endpoint

    this.http.get<any>(apiUrl).subscribe(
      (userProfile) => {
        this.profileForm.patchValue(userProfile); // Load data into the form
        this.internName = userProfile.name; // Assuming the name field is present in the API response

        // If the intern has a profile picture, set it; otherwise, keep the default
        this.profilePictureUrl = userProfile.profilePicture || this.defaultProfilePic; // Update this line based on your API response structure
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
      // Handle logic for saving changes here
      console.log('Profile Updated:', this.profileForm.value);
      this.isEditing = false; // Set editing state to false after saving
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePictureUrl = reader.result; // Preview the selected image
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(): void {
    // Code to upload the profile picture to the server or handle further logic
  }

  dashboard(): void {
    this.router.navigate(['/intern-dashboard']);
  }
  viewProfile() {
    // Implement logout functionality
  }
  changePassword() {
    // Implement logout functionality
  }
  logout() {
    // Implement logout functionality
  }
}
