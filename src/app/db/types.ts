export type Role = "admin" | "doctor" | "patient";
export type Status = "active" | "inactive";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  department?: string | null;
  status: Status;
  createdAt: string;
}

export interface Patient {
  id: string;
  userId?: string | null;
  fullName: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  bloodGroup: string;
  allergies: string;
  emergencyContact: string;
  address: string;
  email: string;
  phone: string;
  chronicDiseases: string;
  medicalNotes: string;
  insurance: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  userId?: string | null;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  email: string;
  phone: string;
  availability: string;
  consultationFee: number;
  department: string;
  status: Status;
  createdAt: string;
}

export type AppointmentStatus =
  | "pending"
  | "approved"
  | "completed"
  | "cancelled"
  | "rejected"
  | "rescheduled";

export interface Appointment {
  id: string;
  number: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  department: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string | null;
  date: string;
  diagnosis: string;
  symptoms: string;
  bloodPressure: string;
  temperature: string;
  weight: string;
  height: string;
  notes: string;
  labRequests: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string | null;
  date: string;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
  type: "info" | "success" | "warning" | "error";
}

export interface Bill {
  id: string;
  number: string;
  patientId: string;
  appointmentId?: string | null;
  consultationFee: number;
  labFee: number;
  medicationFee: number;
  otherCharges: number;
  discount: number;
  tax: number;
  total: number;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
}

export interface SettingRow {
  key: string;
  value: unknown;
}
