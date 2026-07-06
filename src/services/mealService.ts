import { api } from "@/src/lib/api";

export interface BackendKitchen {
    id?: string;
    name?: string;
    slug?: string;
    createdAt?: string;
}

export interface BackendMeal {
    id?: string;
    _id?: string;
    title?: string;
    name?: string;
    price: number;
    category?: string | BackendKitchen | null;
    image?: string;
    rating?: number;
    time?: string;
    kitchen?: BackendKitchen | string | null;
    provider?: BackendKitchen | string | null;
}

export const mealService = {
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

        return response.data;
    },
};