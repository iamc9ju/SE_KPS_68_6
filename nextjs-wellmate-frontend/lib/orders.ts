export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "delivering" | "shipping" | "delivered" | "cancelled";

export type PaymentStatus = "UNPAID" | "PAID";

export type OrderItem = {
    orderItemId: number | string;
    menuItemId: number;
    name: string;
    quantity: number;
    priceAtOrder: number;
    totalPrice: number;
    imageUrl?: string;
};

export type OrderPartner = {
    partnerName?: string;
    address?: string;
    addressLine1?: string;
    district?: string;
    province?: string;
    latitude?: number;
    longitude?: number;
};

export type Order = {
    orderId: string;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    deliveryAddress: string;
    deliveryLatitude?: number;
    deliveryLongitude?: number;
    contactPhone?: string;
    qrCodeUrl?: string;
    createdAt: string;
    items: OrderItem[];
    partner?: OrderPartner;
};

export function unwrapOrderList(payload: unknown): Order[] {
    if (Array.isArray(payload)) {
        return payload as Order[];
    }

    if (payload && typeof payload === "object" && "data" in payload) {
        const nested = (payload as { data?: unknown }).data;
        return Array.isArray(nested) ? (nested as Order[]) : [];
    }

    return [];
}

export function canTrackOrder(order: Pick<Order, "paymentStatus" | "status">) {
    return (
        order.paymentStatus === "PAID" ||
        ["accepted", "preparing", "ready", "delivering", "shipping", "delivered", "cancelled"].includes(order.status)
    );
}
