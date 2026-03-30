import api from "@/lib/api";

export interface MenuItem {
  menuItemId: number;
  foodPartnerId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  caloriesKcal?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
  stockQuantity: number;
  isOutOfStock: boolean;
  isAvailable: boolean;
  foodPartner: {
    foodPartnerId: number;
    partnerName: string;
    description?: string;
    address?: string;
  };
}

export interface CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
  caloriesKcal?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  stockQuantity?: number;
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {
  isAvailable?: boolean;
  isOutOfStock?: boolean;
}

export interface MenuItemParams {
  foodPartnerId?: number;
  categoryId?: number;
  maxCalories?: number;
  q?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedMenuItems {
  data: MenuItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const menuApi = {
  getMenuItems: async (
    params?: MenuItemParams,
  ): Promise<PaginatedMenuItems> => {
    const res = await api.get("/food-menu", { params });
    return res.data;
  },

  getMenuItemById: async (id: number): Promise<MenuItem> => {
    const res = await api.get(`/food-menu/${id}`);
    return res.data;
  },

  createMenuItem: async (data: CreateMenuItemDto): Promise<MenuItem> => {
    const res = await api.post("/food-menu", data);
    return res.data;
  },

  updateMenuItem: async (
    id: number,
    data: UpdateMenuItemDto,
  ): Promise<MenuItem> => {
    const res = await api.patch(`/food-menu/${id}`, data);
    return res.data;
  },

  deleteMenuItem: async (id: number): Promise<{ message: string }> => {
    const res = await api.delete(`/food-menu/${id}`);
    return res.data;
  },

  getCategories: async (): Promise<Array<{ id: number; name: string }>> => {
    const res = await api.get("/food-menu/categories");
    return res.data;
  },
};
