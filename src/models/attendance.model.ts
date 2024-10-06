// attendance.model.ts
export interface Attendence {
    Id: number;
    User_Id: number;
    Name: string;
    Date: string; // Ensure this matches the format expected by the backend
    PRAb: boolean; // true for present, false for absent
    Reason?: string;
}
