export interface BackendReviewCustomer {
    name: string | null;
    image: string | null;
}

export interface BackendReview {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    customerId: string;
    mealId: string;
    customer: BackendReviewCustomer;
}

export interface GetReviewsResponse {
    success: boolean;
    count: number;
    data: BackendReview[];
}

export interface CreateReviewResponse {
    success: boolean;
    message: string;
}

export interface CreateReviewInput {
    rating: number;
    comment?: string;
}