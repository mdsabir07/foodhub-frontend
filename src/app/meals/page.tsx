"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Utensils, Loader2 } from "lucide-react";
import { mealService, BackendMeal } from "@/src/services/mealService";

// Shared modular components
import MealCard, { MealItem } from "@/src/components/MealCard";
import { useCart } from "@/src/hooks/useCart";
import { CartDrawer } from "@/src/components/CartDrawer";
import { OrderSuccessModal } from "@/src/components/OrderSuccessModal";

type SortOption = "default" | "price-low" | "price-high" | "rating";

export default function MealsPage() {
    // 🛒 Core basket engine hook
    const { cart, addToCart, removeFromCart, clearItemRow } = useCart();

    // 📦 UI State Management
    const [meals, setMeals] = useState<MealItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // 🎉 Success overlay lifecycle states
    const [showSuccess, setShowSuccess] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState("");

    // ⚡ 1. Debounce Effect: Buffers keyboard inputs by 400ms to protect database servers
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // ⚡ 2. API Data Synchronization
    useEffect(() => {
        const fetchLiveMenuData = async () => {
            try {
                setLoading(true);
                const responseData = await mealService.getAllMeals(selectedCategory, debouncedSearchQuery);

                let rawMealsArray: BackendMeal[] = [];
                if (Array.isArray(responseData)) {
                    rawMealsArray = responseData;
                } else if (responseData && typeof responseData === "object") {
                    const wrapper = responseData as Record<string, unknown>;
                    if (Array.isArray(wrapper.meals)) {
                        rawMealsArray = wrapper.meals as BackendMeal[];
                    } else if (Array.isArray(wrapper.data)) {
                        rawMealsArray = wrapper.data as BackendMeal[];
                    } else {
                        const fallbackArray = Object.values(wrapper).find(Array.isArray);
                        if (fallbackArray) rawMealsArray = fallbackArray as BackendMeal[];
                    }
                }

                const normalizedData = rawMealsArray.map((item: BackendMeal): MealItem => {
                    let providerName = "Gourmet Bistro";
                    let categoryName = "General";

                    if (item.kitchen && typeof item.kitchen === "object") {
                        const kitchenObj = item.kitchen as Record<string, unknown>;
                        if (typeof kitchenObj.name === "string") providerName = kitchenObj.name;
                    } else if (item.provider && typeof item.provider === "object") {
                        const providerObj = item.provider as Record<string, unknown>;
                        if (typeof providerObj.name === "string") providerName = providerObj.name;
                    } else if (typeof item.provider === "string" && item.provider.trim() !== "") {
                        providerName = item.provider;
                    }

                    if (item.category && typeof item.category === "object") {
                        categoryName = item.category.name || "General";
                    } else if (typeof item.category === "string" && item.category.trim() !== "") {
                        categoryName = item.category.trim();
                    }

                    return {
                        id: item.id || item._id || Math.random().toString(),
                        name: item.title || item.name || "Untitled Meal",
                        provider: providerName,
                        price: Number(item.price) || 0,
                        rating: item.rating || 4.8,
                        time: item.time || "15-25 min",
                        category: categoryName,
                        image: typeof item.image === "string" && item.image.trim() !== "" ? item.image : "🍔"
                    };
                });

                setMeals(normalizedData);
            } catch (error) {
                console.error("Failed to query live meals stream:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveMenuData();
    }, [selectedCategory, debouncedSearchQuery]);

    // ⚡ 3. Derived State: Compile list of unique category tags on the fly
    const categories = ["All", ...Array.from(new Set(meals.map((m) => m.category).filter(Boolean)))];

    // ⚡ 4. Frontend Local Processing (Filters & Sorting fallback)
    const filteredAndSortedMeals = [...meals]
        .filter((meal) => {
            if (selectedCategory === "All") return true;
            return String(meal.category).toLowerCase() === selectedCategory.toLowerCase();
        })
        .sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            if (sortBy === "rating") return b.rating - a.rating;
            return 0;
        });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* 🔍 SEARCH AND FILTERS TOOLBAR */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Craving something sweet or savory? Search here..."
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center justify-between gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm cursor-pointer"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span>Sort By</span>
                        </button>
                        {isSortOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50">
                                {(["default", "price-low", "price-high", "rating"] as const).map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${sortBy === opt ? "text-orange-600 font-semibold" : "text-slate-600 dark:text-slate-300"}`}
                                    >
                                        {opt === "default" && "Recommended"}
                                        {opt === "price-low" && "Price: Low to High"}
                                        {opt === "price-high" && "Price: High to Low"}
                                        {opt === "rating" && "Top Rated Matches"}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 🏷️ DYNAMIC NAVIGATION CATEGORY TABS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
                    {categories.map((category) => {
                        const isActive = selectedCategory.toLowerCase() === category.toLowerCase();
                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${isActive
                                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50"
                                    }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>

                {/* 🥞 LIVE PRODUCTS CARDS DISPLAY LAYER */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
                        <p className="text-sm text-slate-400 font-medium">Sourcing fresh dishes from local kitchens...</p>
                    </div>
                ) : filteredAndSortedMeals.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto">
                        <Utensils className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">No items found</h3>
                        <p className="text-sm text-slate-400 mt-1">We couldn't find matching menu options. Try adjusting your filter tags or search keyword!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedMeals.map((meal) => (
                            <MealCard
                                key={meal.id}
                                meal={meal}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 🛒 MODULAR PORTABLE COMPONENT OVERLAYS */}
            <CartDrawer
                isOpen={isCartOpen}
                setIsOpen={setIsCartOpen}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                clearItemRow={clearItemRow}
                onCheckoutSuccess={(id) => {
                    setCurrentOrderId(id);
                    setShowSuccess(true);
                }}
            />

            <OrderSuccessModal
                isOpen={showSuccess}
                orderId={currentOrderId}
                onClose={() => setShowSuccess(false)}
            />
        </div>
    );
}