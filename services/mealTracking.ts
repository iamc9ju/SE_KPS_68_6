import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

export const mealTrackingService = {
  getDailySummary: async (date: string) => {
    const response = await api.get(`/meal-plans/summary?date=${date}`);
    return response.data;
  },
  
  logMeal: async (planId: number, data: any) => {
    const response = await api.post(`/meal-plans/${planId}/items`, data);
    return response.data;
  },
};
