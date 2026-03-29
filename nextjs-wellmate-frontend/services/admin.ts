import api from "@/lib/api";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return undefined;
  const token = localStorage.getItem("token");
  if (!token) return undefined;
  return { Authorization: `Bearer ${token}` };
};

export const adminService = {
  getDashboard: async () => {
    const response = await api.get("/admin/dashboard", { headers: getAuthHeaders() });
    return response.data.data;
  },
  getPartners: async () => {
    const response = await api.get("/admin/partners", { headers: getAuthHeaders() });
    return response.data.data;
  },
  activatePartner: async (partnerId: number) => {
    const response = await api.patch(`/admin/partners/${partnerId}/activate`, undefined, { headers: getAuthHeaders() });
    return response.data.data;
  },
  deactivatePartner: async (partnerId: number) => {
    const response = await api.patch(`/admin/partners/${partnerId}/deactivate`, undefined, { headers: getAuthHeaders() });
    return response.data.data;
  },
  deletePartner: async (partnerId: number) => {
    const response = await api.delete(`/admin/partners/${partnerId}`, { headers: getAuthHeaders() });
    return response.data.data;
  },
  getUsers: async () => {
    const response = await api.get("/admin/users", { headers: getAuthHeaders() });
    return response.data.data;
  },
  activateUser: async (userId: string) => {
    const response = await api.patch(`/admin/users/${userId}/activate`, undefined, { headers: getAuthHeaders() });
    return response.data.data;
  },
  deactivateUser: async (userId: string) => {
    const response = await api.patch(`/admin/users/${userId}/deactivate`, undefined, { headers: getAuthHeaders() });
    return response.data.data;
  },
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`, { headers: getAuthHeaders() });
    return response.data.data;
  },
  getNutritionists: async (status?: string) => {
    const response = await api.get("/admin/nutritionists", {
      params: status ? { status } : undefined,
      headers: getAuthHeaders(),
    });
    return response.data.data;
  },
  approveNutritionist: async (nutritionistId: string) => {
    const response = await api.patch(`/admin/nutritionists/${nutritionistId}/approve`, undefined, { headers: getAuthHeaders() });
    return response.data.data;
  },
  rejectNutritionist: async (nutritionistId: string) => {
    const response = await api.patch(`/admin/nutritionists/${nutritionistId}/reject`, undefined, { headers: getAuthHeaders() });
    return response.data.data;
  },
};
