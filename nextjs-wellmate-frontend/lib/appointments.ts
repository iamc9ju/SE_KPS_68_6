import api from "./api";
import { AppointmentType } from "./types";

export const getNutritionistAvailability = async (id: string, date: string) => {
  const response = await api.get(`/nutritionists/${id}/availability`, {
    params: { date },
  });
  return response.data;
};

export const createAppointment = async (
  nutritionistId: string,
  startTime: string,
  type: AppointmentType = "online",
) => {
  const response = await api.post("/appointments", {
    nutritionistId,
    startTime,
    type,
  });
  return response.data;
};
