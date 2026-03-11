export type AppointmentType = "online";

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AppointmentResponse {
  appointmentId: string;
  payment: {
    amount: number;
    chargeId: string;
    qrCodeUrl: string;
  };
}
