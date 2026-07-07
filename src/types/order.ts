export interface OrderItem {
    id: string;
    orderId: string;
    mealId: string;
    quantity: number;
    price: number;
    meal: {
        id: string;
        name: string;
        price: number;
        description?: string;
        image?: string;
    };
}

export interface Order {
    id: string;
    _id?: string;
    customerId: string;
    deliveryAddress: string;
    totalAmount: number;
    status: "PLACED" | "PENDING" | "DELIVERED" | "CANCELLED";
    createdAt: string | Date;
    updatedAt: string | Date;
    orderItems: OrderItem[];
}