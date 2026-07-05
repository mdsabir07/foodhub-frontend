"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ShoppingBag, Plus, Minus, X, Utensils, Trash2, Loader2 } from "lucide-react";
import { mealService, BackendMeal } from "@/src/services/mealService";
import MealCard, { MealItem } from "@/src/components/MealCard";


type SortOption = "default" | "price-low" | "price-high" | "rating";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function MealsPage() {
    // Live Database Feed States
    const [meals, setMeals] = useState<MealItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Search Optimization States
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [cart, setCart] = useState<CartItem[]>([]);

    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const categories = ["All", ...Array.from(new Set(meals.map(meal => meal.category).filter(Boolean)))];

    // 1. Debounce Effect: Delays query parameters execution by 400ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400);

        return () => {
            clearTimeout(handler); // Clear timer if user presses another key before 400ms passes
        };
    }, [searchQuery]);

    // ⚡ Hook up live database queries on filter/category changes
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
                        if (fallbackArray) {
                            rawMealsArray = fallbackArray as BackendMeal[];
                        }
                    }
                }

                const normalizedData = rawMealsArray.map((item: BackendMeal): MealItem => {
                    let providerName = "Gourmet Bistro";
                    let categoryName = "General";

                    // 1. Safe Provider/Kitchen Extraction
                    if (item.kitchen && typeof item.kitchen === "object" && "name" in item.kitchen) {
                        const kitchenName = item.kitchen.name;
                        if (typeof kitchenName === "string" && kitchenName.trim() !== "") {
                            providerName = kitchenName.trim();
                        }
                    } else if (item.provider && typeof item.provider === "object" && "name" in item.provider) {
                        const providerNameValue = item.provider.name;
                        if (typeof providerNameValue === "string" && providerNameValue.trim() !== "") {
                            providerName = providerNameValue.trim();
                        }
                    } else if (typeof item.provider === "string" && item.provider.trim() !== "") {
                        providerName = item.provider.trim();
                    }

                    // 2. Safe Category Extraction
                    if (typeof item.category === "string" && item.category.trim() !== "") {
                        categoryName = item.category.trim();
                    } else if (item.category && typeof item.category === "object" && "name" in item.category) {
                        const categoryNameValue = item.category.name;
                        if (typeof categoryNameValue === "string" && categoryNameValue.trim() !== "") {
                            categoryName = categoryNameValue.trim();
                        }
                    }

                    // 3. Safe Image Fallback Processing
                    const mealImage = typeof item.image === "string" && item.image.trim() !== ""
                        ? item.image
                        : "🍔";

                    return {
                        id: item.id || item._id || Math.random().toString(),
                        name: item.title || item.name || "Untitled Meal",
                        provider: providerName,
                        price: Number(item.price) || 0,
                        rating: item.rating || 4.8,
                        time: item.time || "15-25 min",
                        category: categoryName,
                        image: mealImage // 🍳 Image property restored safely!
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

    // 🔥 Cleaned Sorting Pipeline over our already structural string state
    const filteredAndSortedMeals = [...meals]
        .filter((meal) => selectedCategory === "All" || meal.category.toLowerCase() === selectedCategory.toLowerCase())
        .sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            if (sortBy === "rating") return b.rating - a.rating;
            return 0;
        });

    // 🛒 Upgraded Cart Operations System
    const addToCart = (meal: MealItem) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === meal.id);
            if (existing) {
                return prev.map((item) => item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { id: meal.id, name: meal.name, price: meal.price, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart((prev) => prev.map((item) => {
            if (item.id === id) {
                const nextQty = item.quantity + delta;
                return nextQty > 0 ? { ...item, quantity: nextQty } : null;
            }
            return item;
        }).filter(Boolean) as CartItem[]);
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Render a clean layout loader when fetching data streams from localhost:4000
    if (loading && meals.length === 0) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest">
                    Fetching Kitchen Menu...
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">

            {/* HEADER CONTROLS SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Explore Dishes</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Order from curated commercial kitchens near you.</p>
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search menus or kitchens..."
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>

                        {/* 🛠️ NEW: Interactive Filter Sort Toggle Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border cursor-pointer transition-all ${sortBy !== "default"
                                    ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950"
                                    }`}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                <span className="capitalize">{sortBy === "default" ? "Sort" : sortBy.replace("-", " ")}</span>
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-20"
                                        >
                                            <button onClick={() => { setSortBy("default"); setIsSortOpen(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Default Listing</button>
                                            <button onClick={() => { setSortBy("price-low"); setIsSortOpen(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Price: Low to High</button>
                                            <button onClick={() => { setSortBy("price-high"); setIsSortOpen(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Price: High to Low</button>
                                            <button onClick={() => { setSortBy("rating"); setIsSortOpen(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Top Rated ⭐</button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Basket Link Button */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-500 cursor-pointer shadow-lg shadow-orange-600/10 transition-all"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            <span>Basket</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-[10px] font-bold text-white dark:text-slate-900 border-2 border-orange-600">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Categories Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-2 no-scrollbar">
                    {categories.map((category) => {
                        const isActive = selectedCategory.toLowerCase() === category.toLowerCase();
                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${isActive
                                    ? "bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* MEALS PRODUCT GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {filteredAndSortedMeals.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <Utensils className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold">No items found</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">We couldn&apos;t find anything matching your adjustments.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* REACTIVE SIDE-OVER DRAWER BASKET PANEL */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black z-40" />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-slate-200 dark:border-slate-800 flex flex-col"
                        >
                            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-lg">
                                    <ShoppingBag className="text-orange-600" />
                                    <span>Your Basket ({cartCount})</span>
                                </div>
                                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><X className="h-5 w-5" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="text-center py-20 text-slate-400">
                                        <ShoppingBag className="h-10 w-10 mx-auto mb-2 stroke-1" />
                                        <p className="text-sm">Your basket is empty right now.</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                                            <div>
                                                <h4 className="font-bold text-sm">{item.name}</h4>
                                                <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-0.5">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>

                                            {/* Interactive Controls Segment */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-1">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-md"><Minus className="h-3.5 w-3.5" /></button>
                                                    <span className="text-xs font-bold px-1.5 min-w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-md"><Plus className="h-3.5 w-3.5" /></button>
                                                </div>

                                                {/* 🗑️ NEW: Direct Trash Execution Action Button */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                    <div className="flex items-center justify-between font-bold text-base mb-4">
                                        <span>Total Amount:</span>
                                        <span className="text-xl text-orange-600 dark:text-orange-400">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <button className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-500 shadow-lg shadow-orange-600/10 cursor-pointer text-center transition-all">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}