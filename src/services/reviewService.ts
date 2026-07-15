import { api } from "../lib/api";
import { CreateReviewInput, CreateReviewResponse, GetReviewsResponse } from "../types/review";

export const reviewService = {
    // 👥 GET /api/meals/:mealId/reviews (Public Route)
    getMealReviews: async (mealId: string): Promise<GetReviewsResponse> => {
        const response = await api.get<GetReviewsResponse>(`/meals/${mealId}/reviews`);
        return response.data;
    },

    // ✍️ POST /api/meals/:mealId/reviews (Protected Route)
    addReview: async (mealId: string, reviewData: CreateReviewInput): Promise<CreateReviewResponse> => {
        const response = await api.post<CreateReviewResponse>(
            `/meals/${mealId}/reviews`,
            reviewData
        );
        return response.data;
    }
};