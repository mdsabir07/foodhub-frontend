"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react"; // 🎒 Add useState for the button loading indicator

import { Trash2, ArrowRight, ShoppingBag, Plus, Minus, Loader2, MapPin } from "lucide-react";
import { useCart } from "@/src/hooks/useCart";
import { api } from "@/src/lib/api";
import { useAppRouter } from "@/src/hooks/useAppRouter";

// Separate your API helper logic safely inside the client component
function CartContent() {
    const { cart, addToCart, removeFromCart, clearItemRow, clearCart } = useCart();
    const { refresh, navigate } = useAppRouter(); // 💡 FIX: Initialize client-side router hook instance

    // ⏳ Track request runtime states
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    const [deliveryAddress, setDeliveryAddress] = useState("");

    // Calculate checkout totals safely
    const subtotal = cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    const deliveryFee = subtotal > 0 ? 50 : 0;
    const total = subtotal + deliveryFee;

    // 🚀 Handshake function to post order details to your Express backend
    const handleCheckout = async () => {
        if (!deliveryAddress.trim()) {
            setCheckoutError("Please specify a delivery address before proceeding.");
            return;
        }
        try {
            setIsCheckingOut(true);
            setCheckoutError(null);

            // Format data payload structure for your orders schema mapping
            const payload = {
                items: cart.map(item => ({
                    mealId: String(item.id),
                    quantity: Number(item.quantity),
                    price: parseFloat(Number(item.price).toFixed(2)) // 💡 FIX: Force exact 2-decimal floats
                })),
                subtotal: parseFloat(subtotal.toFixed(2)),         // 💡 FIX: Round off float anomalies
                deliveryFee: parseFloat(deliveryFee.toFixed(2)),   // 💡 FIX: Round off float anomalies
                totalAmount: parseFloat(total.toFixed(2)),         // 💡 FIX: Sends clean currency numbers over the wire
                deliveryAddress: deliveryAddress.trim()
            };

            const response = await api.post("/orders", payload);

            if (response.data) {
                // Clear out local storage state on transactional success
                clearCart();
                // Force Next.js to discard cached layouts so the top cart icon count updates to 0 instantly
                refresh()
                // Safely route user to order board using Next.js framework router instead of window object mutation
                navigate("/customer/orders");
            }
        } catch (err) {
            console.error("Checkout transaction failure:", err);
            setCheckoutError("Transaction could not be established. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };

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
                                <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-orange-600 text-slate-500 transition-colors cursor-pointer">
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="font-bold text-sm px-2 text-slate-800 dark:text-slate-100">{item.quantity}</span>
                                <button onClick={() => addToCart(item)} className="p-1 hover:text-orange-600 text-slate-500 transition-colors cursor-pointer">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Delete Button */}
                            <button onClick={() => clearItemRow(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="Remove item">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bill Breakdown Summary Sidebar */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 h-fit shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Summary</h2>
                    {/* Inject interactive address input area directly into summary details context block */}
                    <div className="mb-5">
                        <label htmlFor="" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-orange-600" />
                            <span>Delivery Destination</span>
                        </label>
                        <textarea
                            rows={2}
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Type full street house address details..."
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-orange-500 dark:focus:border-orange-500 resize-none transition-all"
                        />
                    </div>

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

                    {/* Error Notice Panel */}
                    {checkoutError && (
                        <p className="text-xs text-red-500 font-semibold mb-4 text-center">{checkoutError}</p>
                    )}

                    {/* 🔥 CONNECTED CHECKOUT BUTTON */}
                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full flex items-center justify-center gap-2 bg-orange-600 disabled:bg-orange-400 text-white font-bold py-3 rounded-2xl hover:bg-orange-500 shadow-md transition-all cursor-pointer"
                    >
                        {isCheckingOut ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Placing Order...</span>
                            </>
                        ) : (
                            <>
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default dynamic(() => Promise.resolve(CartContent), {
    ssr: false,
    loading: () => <div className="max-w-5xl mx-auto py-16 px-4 text-center text-slate-400">Synchronizing basket...</div>
});