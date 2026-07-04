"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, UtensilsCrossed, LogOut, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo Branding */}
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-orange-600">
                    <UtensilsCrossed className="h-6 w-6" />
                    <span>FoodHub</span>
                </Link>

                {/* Dynamic Navigation Links based on User Role */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                    <Link href="/meals" className="hover:text-orange-600 transition-colors">Browse Meals</Link>

                    {user?.role === "PROVIDER" && (
                        <Link href="/provider/dashboard" className="flex items-center gap-1 text-orange-600 font-semibold">
                            <LayoutDashboard className="h-4 w-4" /> Provider Dashboard
                        </Link>
                    )}
                    {user?.role === "ADMIN" && (
                        <Link href="/admin" className="flex items-center gap-1 text-purple-600 font-semibold">
                            <LayoutDashboard className="h-4 w-4" /> Admin Console
                        </Link>
                    )}
                </nav>

                {/* User Actions Section */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {/* Cart Counter (Only visible to Customers) */}
                            {user.role === "CUSTOMER" && (
                                <Link href="/cart" className="relative p-2 text-slate-600 hover:text-orange-600 transition-colors">
                                    <ShoppingCart className="h-5 w-5" />
                                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-orange-600 text-[10px] font-bold text-white flex items-center justify-center">
                                        0
                                    </span>
                                </Link>
                            )}

                            {/* User Profile Navigation */}
                            <Link
                                href={user.role === "PROVIDER" ? "/provider/dashboard" : user.role === "ADMIN" ? "/admin" : "/orders"}
                                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-orange-600"
                            >
                                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                                    {user.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <span className="hidden sm:inline">{user.name}</span>
                            </Link>

                            {/* Logout Button */}
                            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Log Out">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </>
                    ) : (
                        /* Guest Links */
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">
                                Sign In
                            </Link>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <Link href="/register" className="rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 shadow-md shadow-orange-600/10 transition-all">
                                    Join Now
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}