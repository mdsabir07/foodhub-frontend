import { api } from "@/src/lib/api";

// 1. Define the exact shape your backend sends back
export interface BackendMeal {
    id?: string;
    _id?: string;
    title?: string;
    name?: string;
    price: number;
    category: string;
    image?: string;
    rating?: number;
    time?: string;
    kitchen?: {
        name: string;
    };
    provider?: string;
}

export const mealService = {
    // 2. Type the Promise return value explicitly as an array of BackendMeal
    getAllMeals: async (category?: string, search?: string): Promise<BackendMeal[]> => {
        const queryParams: Record<string, string> = {};

        if (category && category !== "All") {
            queryParams.category = category;
        }

        if (search && search.trim() !== "") {
            queryParams.search = search;
        }

        const response = await api.get<BackendMeal[]>("/meals", {
            params: queryParams,
        });

        // Returning the pure array data directly
        return response.data;
    },
};