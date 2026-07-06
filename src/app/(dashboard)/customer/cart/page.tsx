"use client";

import dynamic from "next/dynamic"; // 🚀 Import Next's dynamic tool
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "@/src/hooks/useCart";

// 1. Move your main cart interface logic into a separate internal component
function CartContent() {
    const { cart, addToCart, removeFromCart, clearItemRow } = useCart();

    // Calculate checkout totals safely
    const subtotal = cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    const deliveryFee = subtotal > 0 ? 50 : 0;
    const total = subtotal + deliveryFee;

    if (!cart || cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-16 w-16 bg-orange-50 dark:bg-orange-950/30 text-orange-600 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Your basket is empty</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                    Looks like you haven't added any delicious meals to your cart yet.
                </p>
                <Link href="/meals" className="mt-6 bg-orange-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-orange-500 transition-all shadow-md">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-8">Your Order Basket</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.name}</h3>
                                <p className="text-orange-600 font-semibold mt-1">{item.price.toFixed(2)} TK</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 bg-slate-50 dark:bg-slate-800">
                                <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-orange-600 text-slate-500 transition-colors">
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="font-bold text-sm px-2 text-slate-800 dark:text-slate-100">{item.quantity}</span>
                                <button onClick={() => addToCart(item)} className="p-1 hover:text-orange-600 text-slate-500 transition-colors">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Delete Button */}
                            <button onClick={() => clearItemRow(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Remove item">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bill Breakdown Summary Sidebar */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 h-fit shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Summary</h2>
                    <div className="space-y-3 text-sm border-b border-slate-200 dark:border-slate-800 pb-4">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Subtotal</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{subtotal.toFixed(2)} TK</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Delivery Fee</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{deliveryFee.toFixed(2)} TK</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-800 dark:text-slate-100 pt-4 mb-6">
                        <span>Total Est.</span>
                        <span className="text-orange-600">{total.toFixed(2)} TK</span>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-3 rounded-2xl hover:bg-orange-500 shadow-md transition-all">
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// 2. 🛡️ FIXED: Force Next.js to load this page only on the client side with SSR turned OFF.
// This completely destroys the hydration bug and eliminates the need for state tracking effects!
export default dynamic(() => Promise.resolve(CartContent), {
    ssr: false,
    loading: () => <div className="max-w-5xl mx-auto py-16 px-4 text-center text-slate-400">Synchronizing basket...</div>
});