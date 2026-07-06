"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Store, Star, MapPin, ShieldCheck } from "lucide-react";
import MealCard from "@/src/components/MealCard";
import { useCart } from "@/src/hooks/useCart";
import { CartDrawer } from "@/src/components/CartDrawer";
import { OrderSuccessModal } from "@/src/components/OrderSuccessModal";

export default function ProviderProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { cart, addToCart, removeFromCart, clearItemRow } = useCart();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState("");

    // Seed data mapping restaurant profile parameters
    const vendor = {
        name: "Gourmet Artisan Kitchen",
        rating: 4.8,
        address: "FoodHub Hub Cluster Alpha, Sector 4",
        bio: "Specializing in organic local farm integrations and slow-cooked protein masterpieces. Verified platform delivery merchant."
    };

    const vendorMeals = [
        { id: "v1", name: "Artisan Smoked Patty", provider: vendor.name, price: 16.00, rating: 4.8, time: "20 min", category: "Burgers", image: "🍔" },
        { id: "v2", name: "Glazed Crisp Wings", provider: vendor.name, price: 12.50, rating: 4.9, time: "15 min", category: "Appetizers", image: "🍗" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
                    <ArrowLeft className="h-4 w-4" /> Back to marketplace
                </button>

                {/* Vendor Bio Header Billboard Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row gap-5 items-start md:items-center shadow-xs">
                    <div className="p-4 bg-orange-600/10 text-orange-600 rounded-2xl shrink-0">
                        <Store className="h-10 w-10" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                        <h1 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">{vendor.name}</h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-500">
                            <div className="flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-500" /> {vendor.rating} Score</div>
                            <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {vendor.address}</div>
                        </div>
                        <p className="text-sm text-slate-400 max-w-2xl pt-1">{vendor.bio}</p>
                    </div>
                </div>

                {/* Isolated dynamic sub menu grid list */}
                <div className="space-y-4">
                    <h2 className="text-lg font-black tracking-tight text-slate-950 dark:text-white uppercase tracking-wider text-xs text-slate-400">
                        Available Menu Collections
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vendorMeals.map((meal) => (
                            <MealCard key={meal.id} meal={meal} onAddToCart={(m) => { addToCart(m); setIsCartOpen(true); }} />
                        ))}
                    </div>
                </div>

            </div>

            {/* Shared Portable Overlays */}
            <CartDrawer
                isOpen={isCartOpen} setIsOpen={setIsCartOpen} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearItemRow={clearItemRow}
                onCheckoutSuccess={(id) => { setCurrentOrderId(id); setShowSuccess(true); }}
            />
            <OrderSuccessModal isOpen={showSuccess} orderId={currentOrderId} onClose={() => setShowSuccess(false)} />
        </div>
    );
}