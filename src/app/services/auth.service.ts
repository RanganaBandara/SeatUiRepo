import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://your-backend-api-url.com/api/auth';  // Replace with your backend API URL

  constructor(private http: HttpClient) { }

  // Method to authenticate user and store token or user details
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        // Assuming the response contains a token and employee details
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('employeeName', response.employeeName);
          localStorage.setItem('employeeId', response.employeeId);
        }
      }),
      catchError(this.handleError('login', []))
    );
  }

  // Method to get the logged-in employee's name
  getEmployeeName(): string | null {
    return localStorage.getItem('employeeName');
  }

  // Method to get the logged-in employee's ID
  getEmployeeId(): string | null {
    return localStorage.getItem('employeeId');
  }

  // Method to check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Method to log out the user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeId');
  }

  // Helper method to handle errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
