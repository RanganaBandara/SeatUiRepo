import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true, 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule] 
})
export class RegisterComponent {
  registerForm: FormGroup;
  private apiUrl = 'http://localhost:5121/User/Register';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
     Email: ['', [Validators.required]],
      Password: ['', Validators.required],
      Phone_Number: ['',Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.http.post(this.apiUrl, this.registerForm.value)
        .subscribe(
          response => {
            console.log('Employee registered successfully', response);
            this.router.navigate(['/login']); 
            
          },
          error => {
            console.error('Error registering employee', error);
          }
        );
    }
  }
}