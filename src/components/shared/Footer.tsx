"use client";

import Link from "next/link";
import { Utensils } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-10 mt-auto w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1 space-y-2">
                    <Link href="/" className="flex items-center gap-1.5">
                        <Utensils className="h-5 w-5 text-orange-600" />
                        <span className="font-black text-lg tracking-tighter text-slate-950 dark:text-white">
                            Dish<span className="text-orange-600">Market</span>
                        </span>
                    </Link>
                    <p className="text-xs text-slate-400 max-w-xs">
                        Connecting curated culinary artists with conscious local communities. Your next meal matters.
                    </p>
                </div>

                {([
                    { title: "Platform", links: ["Our Chefs", "Menu Explorer", "How It Works", "Cart"] },
                    { title: "Support", links: ["Help Center", "Delivery Areas", "Merchant Portal", "Contact Us"] },
                    { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Chef Agreement", "Refunds"] },
                ] as const).map((col) => (
                    <div key={col.title}>
                        <h6 className="font-bold text-xs text-slate-950 dark:text-white uppercase mb-2.5 tracking-wider">
                            {col.title}
                        </h6>
                        <ul className="space-y-1.5">
                            {col.links.map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400 font-medium">
                © 2026 DishMarket Technologies Inc. All rights reserved. Assignments Phase 4 Delivery.
            </div>
        </footer>
    );
}