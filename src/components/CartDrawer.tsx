// 📁 components/cartDrawer.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { MealItem } from "@/src/components/MealCard";
import { useRouter } from "next/navigation"; // 🚀 Import the Next.js router
import Image from "next/image";

interface CartItem extends MealItem {
    quantity: number;
}

interface CartDrawerProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    cart: CartItem[];
    addToCart: (item: MealItem) => void;
    removeFromCart: (id: string) => void;
    clearItemRow: (id: string) => void;
    onCheckoutSuccess: (generatedId: string) => void;
}

export function CartDrawer({
    isOpen,
    setIsOpen,
    cart,
    addToCart,
    removeFromCart,
    clearItemRow,
    onCheckoutSuccess,
}: CartDrawerProps) {
    const router = useRouter(); // 🚀 Instantiate navigation handler
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            {/* FLOATING VIEW CART TOGGLE BUTTON */}
            {totalItemsInCart > 0 && !isOpen && (
                <div className="fixed bottom-6 right-6 z-40">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer"
                    >
                        <span>View Cart Basket</span>
                        <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {totalItemsInCart}
                        </span>
                    </button>
                </div>
            )}

            {/* RIGHT SIDEBAR FLYOUT DRAWER OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black z-50 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl z-50 flex flex-col border-l border-slate-100 dark:border-slate-900"
                        >
                            <div className="p-4 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
                                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Your Orders</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                                >
                                    <X className="h-5 w-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="text-center py-20 text-slate-400">
                                        <p className="text-sm font-medium">Your basket is feeling light...</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900/60 p-3 rounded-xl"
                                        >
                                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                                                {item.image && item.image.startsWith("http") ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        sizes="50px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-2xl select-none">
                                                        {item.image || "🍲"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                                    {item.name}
                                                </h4>
                                                <p className="text-xs text-slate-500">{item.price.toFixed(2)} TK</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-1 shadow-xs">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-slate-500"
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="text-xs font-bold w-4 text-center text-slate-800 dark:text-slate-100">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md text-slate-500"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => clearItemRow(item.id)}
                                                className="p-1.5 hover:text-red-500 text-slate-400 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/30 space-y-3">
                                    <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                                        <span>Total Amount:</span>
                                        <span className="text-xl text-orange-600">{cartTotal.toFixed(2)} TK</span>
                                    </div>

                                    {/* 🔄 FIXED BUTTON: Redirects seamlessly to the real database checkout pipeline */}
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            router.push("/customer/cart");
                                        }}
                                        className="w-full py-3.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-600/10 hover:bg-orange-700 hover:shadow-orange-600/20 active:scale-[0.99] transition-all cursor-pointer text-sm text-center"
                                    >
                                        Proceed to Secure Checkout
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}