"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Star, Clock, ShoppingBag, Plus, Minus, X, Utensils, Trash2, ArrowUpDown, Loader2 } from "lucide-react";
import { mealService } from "@/src/services/mealService";

// Defining an explicit type interface matching the incoming backend structure
interface MealItem {
    id: string;
    name: string;
    provider: string; // If your backend uses 'kitchen.name', map this field safely below
    price: number;
    rating: number;
    time: string;
    category: string;
    image: string;
}

const CATEGORIES = ["All", "Burgers", "Healthy", "Pizza", "Sushi", "Desserts", "Asian"];
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

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState<SortOption>("default");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // ⚡ Hook up live database queries on filter/category changes
    useEffect(() => {
        const fetchLiveMenuData = async () => {
            try {
                setLoading(true);
                const data = await mealService.getAllMeals(selectedCategory, searchQuery);

                // TypeScript now perfectly knows 'data' is an array, and 'item' matches BackendMeal!
                const normalizedData = data.map((item: BackendMeal) => ({
                    id: item.id || item._id || Math.random().toString(),
                    name: item.title || item.name || "Untitled Meal",
                    provider: item.kitchen?.name || item.provider || "Gourmet Bistro",
                    price: Number(item.price),
                    rating: item.rating || 4.8,
                    time: item.time || "15-25 min",
                    category: item.category,
                    image: item.image || "🍔"
                }));

                setMeals(normalizedData);
            } catch (error) {
                console.error("Failed to query live meals stream:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveMenuData();
    }, [selectedCategory, searchQuery]);

    // 🔥 Integrated Sorting Pipeline over the live dataset
    const sortedMeals = [...meals].sort((a, b) => {
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

                {/* CATEGORY CAROUSEL CHIPS */}
                <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${selectedCategory === cat
                                ? "bg-orange-600 text-white shadow-sm"
                                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* MEALS PRODUCT GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {filteredAndSortedMeals.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <Utensils className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold">No items found</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">We couldn't find anything matching your adjustments.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedMeals.map((meal) => (
                            <motion.div
                                key={meal.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-none transition-all"
                            >
                                <div className="h-44 bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-9xl select-none relative group-hover:scale-[1.02] transition-transform duration-300">
                                    {meal.image}
                                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 text-xs font-bold text-orange-600 dark:text-orange-400 backdrop-blur-xs">
                                        {meal.category}
                                    </span>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-lg leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{meal.name}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">by {meal.provider}</p>
                                        </div>
                                        <span className="text-xl font-black text-slate-900 dark:text-white">${meal.price.toFixed(2)}</span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                                            <Star className="h-4 w-4 fill-amber-500" />
                                            <span>{meal.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{meal.time}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => addToCart(meal)}
                                        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl text-sm font-semibold hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 cursor-pointer transition-all"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add to Basket</span>
                                    </button>
                                </div>
                            </motion.div>
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