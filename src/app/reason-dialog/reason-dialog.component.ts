import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatSelectModule } from '@angular/material/select'; // Add this import
@Component({
  selector: 'app-reason-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
    MatDialogModule ,
    MatSelectModule 
  ],
  templateUrl: './reason-dialog.component.html',
  styleUrls: ['./reason-dialog.component.css']
})
export class ReasonDialogComponent {
  // Define an array of predefined reasons
  predefinedReasons: string[] = [
    'Not Informed',
    'Personal reasons',
    'Illness',
    'Emergency',
    'Other'
  ];
  
  reason: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reservationId: number }
  ) {}

  submit() {
    this.dialogRef.close(this.reason);
  }

  cancel() {
    this.dialogRef.close(); 
  }
}
