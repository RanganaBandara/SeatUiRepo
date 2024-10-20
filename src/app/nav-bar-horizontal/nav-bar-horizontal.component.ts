import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-bar-horizontal',
  standalone: true,
  imports: [CommonModule,], // Import CommonModule here
  templateUrl: './nav-bar-horizontal.component.html',
  styleUrls: ['./nav-bar-horizontal.component.css'],
})
export class NavBarHorizontalComponent {
  isDropdownOpen = false; // Controls dropdown visibility
  internName = ''; // Dynamic intern name from backend
  profileImageUrl = 'assets/user.png'; // Default profile image URL

  private router = inject(Router);
  constructor(private http: HttpClient) {} // Inject HttpClient

  ngOnInit() {
    this.loadInternProfile(); // Fetch intern profile on component initialization
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Toggle dropdown visibility
  }

  // goToProfile() {
  //   console.log('Navigating to Profile...');
  // }

  goToProfile(): void {
    console.log('Navigating to Profile...'); // Check if this logs
    this.router.navigate(['/intern-profile']);
  }
  message(){
    this.router.navigate(['/message']);    
  }

  goToSettings() {
    console.log('Navigating to Settings...');
  }

  // Fetch intern profile (name and image URL) from backend API
  loadInternProfile() {
    const apiUrl = 'https://your-backend-api.com/api/intern/profile'; // Replace with actual API URL
    this.http.get(apiUrl).subscribe(
      (data: any) => {
        this.internName = data.name; // Assume backend sends 'name' field
        this.profileImageUrl = data.profileImageUrl || 'assets/user.png'; // Fallback to default image if none provided
      },
      (error) => {
        console.error('Error fetching intern profile', error);
      }
    );
  }
}