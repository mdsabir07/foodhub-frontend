"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/api";
import { getErrorMessage } from "@/src/lib/error";
import { MapPin, Phone, ShoppingBag, CreditCard, Loader2 } from "lucide-react";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function CheckoutPage() {
    const router = useRouter();

    // Input states
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // FIXED: Hydrate state directly inside initializer to prevent linter and cascading render warnings
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("foodhub_cart");
            if (savedCart) {
                try {
                    return JSON.parse(savedCart);
                } catch (e) {
                    console.error("Cart hydration error:", e);
                }
            }
        }
        return [];
    });

    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 3.99 : 0;
    const grandTotal = subtotal + deliveryFee;

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            setError("Your cart is empty. Browse the menu to add meals.");
            return;
        }

        setError("");
        setPending(true);

        try {
            // Create payload matching assignment specifications
            const orderPayload = {
                items: cartItems.map(item => ({
                    mealId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: grandTotal,
                deliveryAddress: address,
                contactPhone: phoneNumber,
                paymentMethod: "CASH_ON_DELIVERY",
                status: "PLACED" // Required initial state
            };

            const res = await api.post("/orders", orderPayload);

            if (res.data?.success || res.status === 201 || res.status === 200) {
                localStorage.removeItem("foodhub_cart"); // Clear basket
                router.push("/customer/orders"); // Forward directly to tracking page
            } else {
                setError(res.data?.message || "Order rejection returned from server.");
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Network timeout encountered while placing order."));
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* DELIVERY DETAILS FORM */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
                    <h1 className="text-xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-orange-600" /> Cash on Delivery Checkout
                    </h1>

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 text-red-600 rounded-xl text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handlePlaceOrder} className="space-y-4 mt-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Dropoff Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                                <textarea
                                    rows={3}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    disabled={pending}
                                    placeholder="Street Name, Building/Apartment Number, City"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl outline-none resize-none text-slate-800 dark:text-slate-100"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    disabled={pending}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-orange-100 dark:bg-orange-950/30 text-orange-600 rounded-lg flex items-center justify-center">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-950 dark:text-white">Cash on Delivery (COD)</p>
                                        <p className="text-[11px] text-slate-400">Hand cash over directly during delivery courier fulfillment.</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-extrabold uppercase bg-orange-600/10 text-orange-600 px-2 py-0.5 rounded border border-orange-500/20">Active</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={pending || cartItems.length === 0}
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 font-bold text-xs text-white rounded-xl shadow-md transition-all uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & Place Order"}
                        </button>
                    </form>
                </div>
            </div>

            {/* MINI BASKET MONITOR */}
            <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                    <h2 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">Review Items</h2>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto custom-scrollbar">
                        {cartItems.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">Your basket is empty.</p>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                                        <p className="text-slate-400 font-medium">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                    </div>
                                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2 space-y-1.5 text-xs font-semibold text-slate-500">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-sm font-black text-slate-950 dark:text-white">
                            <span>Total Bill</span>
                            <span className="font-mono text-orange-600">${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}