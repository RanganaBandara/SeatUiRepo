import { Component, Input } from '@angular/core';
import { input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-booking-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-error-modal.component.html',
  styleUrl: './booking-error-modal.component.css'
})
export class BookingErrorModalComponent {
  @Input() errorMessage: string | null = null;
  //@Input() successMessage: string | null = null; // Ensure this exists
  closeModal() {
    this.errorMessage = null; // Reset error message
}
}
