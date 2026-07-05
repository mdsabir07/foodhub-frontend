import { useState, useEffect } from "react";
import { MealItem } from "@/src/components/MealCard";

export interface CartItem extends MealItem {
    quantity: number;
}

export function useCart() {
    // Lazy Initializer: Runs exactly once before the initial component mount
    const [cart, setCart] = useState<CartItem[]>(() => {
        // Prevent crashes during Next.js server-side rendering builds
        if (typeof window !== "undefined") {
            try {
                const savedCart = localStorage.getItem("foodhub_cart");
                return savedCart ? JSON.parse(savedCart) : [];
            } catch (error) {
                console.error("Failed to recover saved basket items:", error);
                return [];
            }
        }
        return [];
    });

    // 📤 Automatically backup the cart data whenever it mutates
    // (Keep this effect, it's correct because it writes OUT to an external system!)
    useEffect(() => {
        try {
            localStorage.setItem("foodhub_cart", JSON.stringify(cart));
        } catch (error) {
            console.error("Failed to backup basket session:", error);
        }
    }, [cart]);

    // ➕ Action: Add item or step up quantity
    const addToCart = (meal: MealItem) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === meal.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...meal, quantity: 1 }];
        });
    };

    // ➖ Action: Reduce quantity or remove item entirely
    const removeFromCart = (mealId: string) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === mealId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    // Action: Wipe out a single item row instantly
    const clearItemRow = (mealId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== mealId));
    };

    return {
        cart,
        addToCart,
        removeFromCart,
        clearItemRow,
    };
}