"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Clock, ShieldCheck, ShoppingBag, Flame } from "lucide-react";
import { useCart } from "@/src/hooks/useCart";
import { CartDrawer } from "@/src/components/CartDrawer";
import { OrderSuccessModal } from "@/src/components/OrderSuccessModal";

export default function MealDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { cart, addToCart, removeFromCart, clearItemRow } = useCart();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState("");

    // Simulated item lookup state matching backend schema specifications
    const meal = {
        id: id,
        name: "Signature Premium Plate",
        provider: "Gourmet Artisan Kitchen",
        price: 24.50,
        rating: 4.9,
        time: "20-30 min",
        category: "Specialties",
        image: "🍳",
        description: "Vetted by our internal food safety board, this premium formulation brings fresh, farm-sourced local protein and organic hand-cut elements directly to your table."
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

                {/* Back navigation wire */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to listings
                </button>

                {/* Core details layout card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xs">

                    {/* Big visual graphic thumbnail element frame */}
                    <div className="bg-slate-50 dark:bg-slate-950 aspect-square rounded-2xl flex items-center justify-center text-7xl select-none border border-slate-100 dark:border-slate-900">
                        {meal.image}
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

                            <div className="flex items-center gap-4 pt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                <div className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-500 fill-amber-500" /> {meal.rating} Reviews</div>
                                <div className="flex items-center gap-1"><Clock className="h-4 w-4 text-slate-400" /> {meal.time}</div>
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

            </div>

            {/* Shared Portable Overlays overlay switches */}
            <CartDrawer
                isOpen={isCartOpen} setIsOpen={setIsCartOpen} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearItemRow={clearItemRow}
                onCheckoutSuccess={(id) => { setCurrentOrderId(id); setShowSuccess(true); }}
            />
            <OrderSuccessModal isOpen={showSuccess} orderId={currentOrderId} onClose={() => setShowSuccess(false)} />
        </div>
    );
}