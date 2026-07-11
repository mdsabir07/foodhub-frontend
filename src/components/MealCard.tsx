"use client";

import { Clock, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface MealItem {
    id: string;
    name: string;
    provider: string;
    price: number;
    rating: number;
    time: string;
    category: string;
    image: string;
}

interface MealCardProps {
    meal: MealItem;
    onAddToCart: (meal: MealItem) => void;
}

export default function MealCard({ meal, onAddToCart }: MealCardProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
                {/* { 1. meal image / emoji} */}
                <div className="relative w-full h-48 mb-3 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    {meal.image && meal.image.startsWith("http") ? (
                        <Image
                            src={meal.image}
                            alt={meal.name}
                            fill // Tells Next.js to fill the parent container completely
                            sizes="(max-w-7xl) 33vw, 100vw" // Helps Next.js choose the right size
                            className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-4xl">
                            {meal.image || "🍲" /* Fallback to a default emoji if no image is provided */}
                        </div>
                    )}
                </div>
                {/* 2. Meal name */}
                <Link href={`/meals/${meal.id}`} className="hover:text-orange-600 transition-colors">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{meal.name}</h3>
                </Link>
                {/* 3. Provider name */}
                <p className="text-xs text-slate-500 mt-1">{meal.provider}</p>
                {/* 4. Details Row */}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                            {meal.rating}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{meal.time}</span>
                    </div>
                </div>
            </div>
            {/* 5. Bottom Row: Price and Action Button */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/40 pt-4">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                    ${Number(meal.price).toFixed(2)}
                </span>

                <button
                    onClick={() => onAddToCart(meal)}
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white rounded-xl text-sm font-semibold hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 cursor-pointer transition-all"
                >
                    <ShoppingBag className="h-4 w-4" /> Add
                </button>
            </div>
        </div>
    );
}