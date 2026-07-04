"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, UtensilsCrossed, LogOut, LayoutDashboard, Sun, Moon, Laptop } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";

export function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo Branding */}
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-orange-600 select-none">
                    <UtensilsCrossed className="h-6 w-6" />
                    <span>FoodHub</span>
                </Link>

                {/* Dynamic Navigation Links based on User Role */}
                <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">

                    {/* Browse Meals Route Link */}
                    <Link
                        href="/meals"
                        className={`relative px-3 py-2 rounded-xl transition-colors ${pathname === "/meals" ? "text-orange-600 font-semibold" : "hover:text-orange-600 dark:hover:text-orange-500"
                            }`}
                    >
                        <span>Browse Meals</span>
                        {pathname === "/meals" && (
                            <motion.div
                                layoutId="activeNavIndicator"
                                className="absolute inset-0 bg-orange-50/60 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20 rounded-xl -z-10"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                    </Link>

                    {user?.role === "PROVIDER" && (
                        <Link
                            href="/provider/dashboard"
                            className={`relative flex items-center gap-1 px-3 py-2 rounded-xl transition-colors ${pathname === "/provider/dashboard" ? "text-orange-600 font-bold" : "text-orange-600 dark:text-orange-400 font-semibold"
                                }`}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Provider Dashboard</span>
                            {pathname === "/provider/dashboard" && (
                                <motion.div
                                    layoutId="activeNavIndicator"
                                    className="absolute inset-0 bg-orange-50/60 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20 rounded-xl -z-10"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    )}

                    {user?.role === "ADMIN" && (
                        <Link
                            href="/admin"
                            className={`relative flex items-center gap-1 px-3 py-2 rounded-xl transition-colors ${pathname === "/admin" ? "text-purple-600 font-bold" : "text-purple-600 dark:text-purple-400 font-semibold"
                                }`}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Admin Console</span>
                            {pathname === "/admin" && (
                                <motion.div
                                    layoutId="activeNavIndicator"
                                    className="absolute inset-0 bg-purple-50/60 dark:bg-purple-500/10 border border-purple-200/50 dark:border-purple-500/20 rounded-xl -z-10"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    )}
                </nav>

                {/* User Interaction Corner */}
                <div className="flex items-center gap-4">

                    {/* 🌗 Interactive Cycle Theme Controller */}
                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light")}
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        title={`Theme: ${theme} (Click to change)`}
                    >
                        {theme === "light" && <Sun className="h-5 w-5 text-amber-500" />}
                        {theme === "dark" && <Moon className="h-5 w-5 text-indigo-400" />}
                        {theme === "system" && <Laptop className="h-5 w-5 text-slate-400" />}
                    </button>

                    {user ? (
                        <>
                            {/* Cart Counter (Only visible to Customers) */}
                            {user.role === "CUSTOMER" && (
                                <Link href="/cart" className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-orange-600 transition-colors">
                                    <ShoppingCart className="h-5 w-5" />
                                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-orange-600 text-[10px] font-bold text-white flex items-center justify-center">
                                        0
                                    </span>
                                </Link>
                            )}

                            {/* User Profile Navigation */}
                            <Link
                                href={user.role === "PROVIDER" ? "/provider/dashboard" : user.role === "ADMIN" ? "/admin" : "/orders"}
                                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-orange-600"
                            >
                                <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-700 dark:text-orange-400 font-bold">
                                    {user.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <span className="hidden sm:inline text-slate-600 dark:text-slate-300">{user.name}</span>
                            </Link>

                            {/* Logout Button */}
                            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="Log Out">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </>
                    ) : (
                        /* Guest Links */
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-orange-600 transition-colors">
                                Sign In
                            </Link>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <Link href="/register" className="rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 shadow-md transition-all">
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