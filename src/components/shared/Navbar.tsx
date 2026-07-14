"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ShoppingCart,
    UtensilsCrossed,
    LogOut,
    LayoutDashboard,
    Sun,
    Moon,
    Laptop,
    ChevronDown,
    User,
    ClipboardList,
    ShieldAlert,
    Menu,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { useCart } from "@/src/hooks/useCart";

export function Navbar() {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { cart } = useCart();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Calculate total items in basket reactively
    const totalItemsCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

    // 🛡️ SECURITY UX GUARD: Do not show logged-in actions if the user is physically on auth pages
    const shouldShowUserActions = user && !isAuthPage;

    // Close the user dropdown when clicking outside of the element
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // If click is inside the dropdown container, do nothing
            if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) return;
            setIsDropdownOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Automatically close menus on navigation path changes
    // (kept as a no-op for lint; user can close via outside click / toggle)
    useEffect(() => {
        // Intentionally left blank.
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo Branding */}
                <Link href="/" className="flex items-center gap-2 text-xl select-none">
                    <UtensilsCrossed className="h-6 w-6 text-orange-600" />
                    <span className="font-black tracking-tighter text-slate-950 dark:text-white">Dish<span className="text-orange-600">Market</span></span>
                </Link>

                {/* Browse Meals (Shared Public Link) */}
                <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
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

                    {/* Quick Access Tabs for Admins/Providers (Desktop) */}
                    {shouldShowUserActions && user.role === "PROVIDER" && (
                        <Link
                            href="/provider/dashboard"
                            className={`relative flex items-center gap-1 px-3 py-2 rounded-xl transition-colors ${pathname.startsWith("/provider") ? "text-orange-600 font-bold" : "text-slate-600 dark:text-slate-300 hover:text-orange-600"
                                }`}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Kitchen Panel</span>
                        </Link>
                    )}

                    {shouldShowUserActions && user.role === "ADMIN" && (
                        <Link
                            href="/admin"
                            className={`relative flex items-center gap-1 px-3 py-2 rounded-xl transition-colors ${pathname.startsWith("/admin") ? "text-purple-600 font-bold" : "text-slate-600 dark:text-slate-300 hover:text-purple-600"
                                }`}
                        >
                            <ShieldAlert className="h-4 w-4" />
                            <span>Admin Console</span>
                        </Link>
                    )}
                </nav>

                {/* User Interaction Corner */}
                <div className="flex items-center gap-3">

                    {/* 🌗 Dynamic Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light")}
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        title={`Theme: ${theme} (Click to change)`}
                    >
                        {theme === "light" && <Sun className="h-5 w-5 text-amber-500" />}
                        {theme === "dark" && <Moon className="h-5 w-5 text-indigo-400" />}
                        {theme === "system" && <Laptop className="h-5 w-5 text-slate-400" />}
                    </button>

                    {/* 🛡️ ONLY show user menu if they are fully logged in AND NOT on an auth page */}
                    {user && !isAuthPage ? (
                        <>
                            {/* Shopping Cart Trigger (Customer Only) */}
                            {user.role === "CUSTOMER" && (
                                <Link
                                    href="/customer/cart"
                                    className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-orange-600 transition-colors"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {totalItemsCount > 0 && (
                                        <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-orange-600 text-[9px] font-black text-white flex items-center justify-center shadow-sm">
                                            {totalItemsCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* Profile Dropdown Container */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                                    aria-expanded={isDropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                                        {user.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <span className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                                        {user.name?.split(" ")[0]}
                                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15, ease: "easeOut" }}
                                            className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl ring-1 ring-black/5 focus:outline-none z-50"
                                        >
                                            <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                                                <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate mt-0.5">{user.name}</p>
                                                <p className="text-[10px] font-mono text-orange-600 dark:text-orange-400 mt-0.5 tracking-wider font-extrabold uppercase">{user.role}</p>
                                            </div>

                                            <div className="py-1.5 space-y-0.5">
                                                {/* Role-Specific Items */}
                                                {user.role === "CUSTOMER" && (
                                                    <>
                                                        <Link href="/customer/profile" className="flex items-center gap-3.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all">
                                                            <User className="h-4.5 w-4.5" />
                                                            <span>My Profile</span>
                                                        </Link>
                                                        <Link href="/customer/orders" className="flex items-center gap-3.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all">
                                                            <ClipboardList className="h-4.5 w-4.5" />
                                                            <span>My Orders</span>
                                                        </Link>
                                                    </>
                                                )}

                                                {user.role === "PROVIDER" && (
                                                    <>
                                                        <Link href="/provider/dashboard" className="flex items-center gap-3.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all">
                                                            <LayoutDashboard className="h-4.5 w-4.5" />
                                                            <span>Kitchen Dashboard</span>
                                                        </Link>
                                                        <Link href="/customer/profile" className="flex items-center gap-3.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all">
                                                            <User className="h-4.5 w-4.5" />
                                                            <span>Kitchen Profile</span>
                                                        </Link>
                                                    </>
                                                )}

                                                {user.role === "ADMIN" && (
                                                    <>
                                                        <Link href="/admin" className="flex items-center gap-3.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all">
                                                            <LayoutDashboard className="h-4.5 w-4.5" />
                                                            <span>Admin Overview</span>
                                                        </Link>
                                                        <Link href="/admin/users" className="flex items-center gap-3.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all">
                                                            <User className="h-4.5 w-4.5" />
                                                            <span>Manage Registry</span>
                                                        </Link>
                                                    </>
                                                )}
                                            </div>

                                            {/* Logout Trigger */}
                                            <div className="border-t border-slate-100 dark:border-slate-800 pt-1.5 pb-0.5">
                                                <button
                                                    onClick={logout}
                                                    className="w-full flex items-center gap-3.5 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer"
                                                >
                                                    <LogOut className="h-4.5 w-4.5" />
                                                    <span>Log Out</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        /* Guest Links (Always shown if not logged in OR if on auth pages) */
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-orange-600 transition-colors"
                            >
                                Sign In
                            </Link>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    href="/register"
                                    className="rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 shadow-md transition-all"
                                >
                                    Join Now
                                </Link>
                            </motion.div>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                </div>
            </div>

            {/* Mobile Sidebar Panel */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <Link
                                href="/meals"
                                className="block px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-orange-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            >
                                Browse Meals
                            </Link>

                            {shouldShowUserActions && user.role === "PROVIDER" && (
                                <Link
                                    href="/provider/dashboard"
                                    className="block px-3 py-2 text-sm font-bold text-orange-600 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 rounded-xl"
                                >
                                    Kitchen Panel
                                </Link>
                            )}

                            {shouldShowUserActions && user.role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    className="block px-3 py-2 text-sm font-bold text-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 rounded-xl"
                                >
                                    Admin Console
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}