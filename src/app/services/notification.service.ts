import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {}
  showSuccess(message: string) {
    alert(message); // Replace with a proper notification system in production
  }

  showError(message: string) {
    alert(message); // Replace with a proper notification system in production
  }
}
