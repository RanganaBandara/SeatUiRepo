export interface Seat {
    number: number;
    bookings: { [date: string]: boolean };
    isAvailable?: boolean;
    status: string; // "Available" or "Booked"
  }