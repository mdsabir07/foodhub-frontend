"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Star, Clock, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/src/hooks/useCart";
import { CartDrawer } from "@/src/components/CartDrawer";
import { OrderSuccessModal } from "@/src/components/OrderSuccessModal";
import { useAppRouter } from "@/src/hooks/useAppRouter";

// 🔐 Import your auth-client session hooks to check login status
import { useSession } from "@/src/lib/auth-client";
// 💬 Import our newly built MealReviews component
import MealReviews from "@/src/components/MealReviews";
// 📦 Import your shared MealItem type
import { MealItem } from "@/src/components/MealCard";

// 📝 Extend MealItem locally to include description for the details page
interface MealDetailData extends MealItem {
    description?: string;
}

export default function MealDetailsPage() {
    const params = useParams();
    const { back } = useAppRouter();
    const { cart, addToCart, removeFromCart, clearItemRow } = useCart();

    // 🔐 Get session data
    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState("");

    // ⚡ Dynamic Data States
    const [meal, setMeal] = useState<MealDetailData | null>(null);
    const [loading, setLoading] = useState(true);

    // Safely extract ID
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

    // 🔄 Fetch live meal data on page mount
    useEffect(() => {
        if (!id) return;

        const fetchSingleMeal = async () => {
            try {
                setLoading(true);
                // Fetch direct from your API route (Update path if your single meal endpoint differs)
                const res = await fetch(`/api/meals/${id}`);
                if (!res.ok) throw new Error("Failed to fetch meal data");

                const responseData = await res.json();

                // Accommodate standard API payload wrappers
                const rawItem = responseData.meal || responseData.data || responseData;

                // Safely normalize relational strings
                let providerName = "Gourmet Artisan Kitchen";
                if (rawItem.kitchen?.name) providerName = rawItem.kitchen.name;
                else if (rawItem.provider?.name) providerName = rawItem.provider.name;
                else if (typeof rawItem.provider === "string") providerName = rawItem.provider;

                let categoryName = "Specialties";
                if (rawItem.category?.name) categoryName = rawItem.category.name;
                else if (typeof rawItem.category === "string") categoryName = rawItem.category;

                // Tell TS about the relations to bypass 'any' errors
                const extendedItem = rawItem as unknown as {
                    reviews?: Array<{ id: string; rating: number; comment: string | null; createdAt: string }>
                };

                setMeal({
                    id: rawItem.id || id,
                    name: rawItem.name || rawItem.title || "Untitled Dish",
                    provider: providerName,
                    price: Number(rawItem.price) || 0,
                    reviews: extendedItem.reviews || [],
                    time: rawItem.time || "20-30 min",
                    category: categoryName,
                    image: typeof rawItem.image === "string" && rawItem.image.trim() !== "" ? rawItem.image : "",
                    description: rawItem.description || "Vetted by our internal food safety board, this premium formulation brings fresh, farm-sourced local protein and organic hand-cut elements directly to your table."
                });

            } catch (error) {
                console.error("Error fetching meal details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSingleMeal();
    }, [id]);

    // 📊 Compute dynamic review stats for the UI
    const totalReviews = meal?.reviews?.length || 0;
    const averageRating = totalReviews > 0
        ? (meal!.reviews!.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
        : "New";

    // 🔄 Loading State UI
    if (loading || !meal) {
        return (
            <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
                <p className="text-sm text-slate-400 font-bold animate-pulse">Loading culinary assets...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

                {/* Back navigation wire */}
                <button
                    onClick={() => back()}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to listings
                </button>

                {/* Core details layout card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xs">

                    {/* Big visual graphic thumbnail */}
                    <div className="relative bg-slate-50 dark:bg-slate-950 aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-900/40">
                        {meal.image && meal.image.startsWith("http") ? (
                            <Image
                                src={meal.image}
                                alt={meal.name}
                                fill
                                priority
                                sizes="(max-w-4xl) 50vw, 100vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-7xl select-none">
                                {meal.image || "🍲"}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-orange-500/10 text-orange-600 px-2.5 py-1 rounded-md inline-block">
                                {meal.category}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                                {meal.name}
                            </h1>
                            <p className="text-xs font-bold text-slate-400">
                                Crafted and distributed by: <span className="text-orange-600 cursor-pointer hover:underline">{meal.provider}</span>
                            </p>

                            {/* Dynamic Rating UI */}
                            <div className="flex items-center gap-4 pt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                <div className="flex items-center gap-1">
                                    <Star className={`h-4 w-4 ${totalReviews > 0 ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                                    {totalReviews > 0 ? `${averageRating} (${totalReviews} Reviews)` : "No reviews yet"}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-slate-400" /> {meal.time}
                                </div>
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
                                {meal.description}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Retail Value</span>
                                <span className="text-2xl font-black text-slate-950 dark:text-white">${meal.price.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={() => {
                                    addToCart(meal);
                                    setIsCartOpen(true);
                                }}
                                className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl text-sm shadow-xl shadow-orange-600/10 hover:bg-orange-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <ShoppingBag className="h-4 w-4" /> Include in Market Basket
                            </button>
                        </div>
                    </div>
                </div>

                {/* 💬 Integrated Live Database Reviews Module */}
                {id && (
                    <MealReviews
                        mealId={id}
                        isLoggedIn={isLoggedIn}
                    />
                )}

            </div>

            {/* Shared Portable Overlays */}
            <CartDrawer
                isOpen={isCartOpen}
                setIsOpen={setIsCartOpen}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                clearItemRow={clearItemRow}
                onCheckoutSuccess={(id) => { setCurrentOrderId(id); setShowSuccess(true); }}
            />
            <OrderSuccessModal isOpen={showSuccess} orderId={currentOrderId} onClose={() => setShowSuccess(false)} />
        </div>
    );
}