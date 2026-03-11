import api from "@/lib/api";

export interface Appointment {
  appointmentId: string;
  patientId: string;
  nutritionistId: string;
  startTime: string;
  endTime: string;
  type: "online";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  chargeId?: string | null;
  amount?: number | null;
  qrCodeUrl?: string | null;
  createdAt: string;
  deletedAt?: string | null;

  // Relations mapped from GET /appointments/me or GET /appointments/:id
  nutritionist?: {
    nutritionistId: string;
    firstName: string;
    lastName: string;
    user?: {
      email: string;
      profileImageUrl?: string | null;
    };
  };
  patient?: {
    userId: string;
    firstName?: string;
    lastName?: string;
  };
  payment?: {
    amount: number;
    qrCodeUrl: string;
    chargeId?: string;
  };
  chatRoom?: {
    chatRoomId: string;
  };
}

export interface CreateAppointmentDto {
  nutritionistId: string;
  startTime: string;
  type: "online";
}

export const appointmentsApi = {
  create: async (dto: CreateAppointmentDto) => {
    const response = await api.post("/appointments", dto);
    return response.data.data;
  },

  getMyAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get("/appointments/me");
    return response.data.data;
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data.data;
  },
};
