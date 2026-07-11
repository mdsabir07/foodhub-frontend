// 📁 hooks/useCart.ts
import { useState, useEffect } from "react";
import { MealItem } from "@/src/components/MealCard";

export interface CartItem extends MealItem {
    quantity: number;
}

const CART_SYNC_EVENT = "foodhub_cart_updated";

export function useCart() {
    // 🔄 FIX: Start with a clean empty array so Server and Client render match perfectly
    const [cart, setCart] = useState<CartItem[]>([]);

    // 🆕 Hydrate the cart from localStorage safely after the component mounts on the client
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem("foodhub_cart");
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error("Failed to recover saved basket items:", error);
        }
    }, []);

    // LISTEN FOR CART MUTATIONS ACROSS OTHER COMPONENTS INSTANTLY
    useEffect(() => {
        const handleSync = () => {
            try {
                const savedCart = localStorage.getItem("foodhub_cart");
                setCart(savedCart ? JSON.parse(savedCart) : []);
            } catch (error) {
                console.error("Failed to sync cart updates:", error);
            }
        };

        window.addEventListener(CART_SYNC_EVENT, handleSync);
        return () => window.removeEventListener(CART_SYNC_EVENT, handleSync);
    }, []);

    const updateAndBroadcast = (newCart: CartItem[]) => {
        setCart(newCart);
        if (typeof window !== "undefined") {
            localStorage.setItem("foodhub_cart", JSON.stringify(newCart));
            window.dispatchEvent(new Event(CART_SYNC_EVENT));
        }
    };

    const addToCart = (meal: MealItem) => {
        const existing = cart.find((item) => item.id === meal.id);
        let updatedCart: CartItem[];

        if (existing) {
            updatedCart = cart.map((item) =>
                item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            updatedCart = [...cart, { ...meal, quantity: 1 }];
        }
        updateAndBroadcast(updatedCart);
    };

    const removeFromCart = (mealId: string) => {
        const updatedCart = cart
            .map((item) =>
                item.id === mealId ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0);

        updateAndBroadcast(updatedCart);
    };

    const clearItemRow = (mealId: string) => {
        const updatedCart = cart.filter((item) => item.id !== mealId);
        updateAndBroadcast(updatedCart);
    };

    // Action: Completely wipe out the entire cart session after a checkout completion
    const clearCart = () => {
        updateAndBroadcast([]);
    };

    return {
        cart,
        addToCart,
        removeFromCart,
        clearItemRow,
        clearCart
    };
}