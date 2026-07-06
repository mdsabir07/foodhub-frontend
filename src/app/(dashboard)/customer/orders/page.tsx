"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/src/components/shared/ProtectedRoute";
import { Clock, CheckCircle2, ChevronRight, ShoppingBag, MapPin, Utensils } from "lucide-react";

// Mock data architecture matching database ordering schemas
const MOCK_ORDERS = [
    {
        id: "ORD-849201",
        kitchenName: "Gourmet Bistro",
        itemsCount: 3,
        totalPrice: "$42.50",
        date: "Today, 12:30 PM",
        status: "PREPARING", // ACTIVE WORKFLOWS: PENDING, PREPARING, READY, COMPLETED
        items: "1x Truffle Glazed Burger, 2x Sweet Potato Fries"
    },
    {
        id: "ORD-731940",
        kitchenName: "Zen Foods",
        itemsCount: 1,
        totalPrice: "$14.20",
        date: "Yesterday",
        status: "COMPLETED",
        items: "1x Fresh Salmon Poke Bowl"
    },
    {
        id: "ORD-294012",
        kitchenName: "The Sweet Spot",
        itemsCount: 2,
        totalPrice: "$18.00",
        date: "July 2, 2026",
        status: "COMPLETED",
        items: "2x Matcha Lava Cakes"
    }
];

export default function OrdersHistoryPage() {
    const [activeTab, setActiveTab] = useState<"active" | "past">("active");

    const filteredOrders = MOCK_ORDERS.filter(order => {
        if (activeTab === "active") return order.status !== "COMPLETED";
        return order.status === "COMPLETED";
    });

    return (
        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
                <div className="mx-auto max-w-3xl space-y-6">

                    {/* PAGE HEADER */}
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Your Orders</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Track live kitchen progress and review your historical meal tickets.
                        </p>
                    </div>

                    {/* TAB CONTROL SWITCHER */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`relative pb-3 transition-colors cursor-pointer ${activeTab === "active" ? "text-orange-600" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                }`}
                        >
                            Active Deliveries
                            {activeTab === "active" && (
                                <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("past")}
                            className={`relative pb-3 transition-colors cursor-pointer ${activeTab === "past" ? "text-orange-600" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                }`}
                        >
                            Past Receipts
                            {activeTab === "past" && (
                                <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
                            )}
                        </button>
                    </div>

                    {/* ORDERS LIST RENDERING */}
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3"
                                >
                                    <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <ShoppingBag className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300">No orders found</h3>
                                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                                        Looks like you haven't placed any tickets in this section yet.
                                    </p>
                                </motion.div>
                            ) : (
                                filteredOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        {/* LEFT CONTAINER: INFO BLOCK */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                    {order.id}
                                                </span>
                                                <span className="text-xs text-slate-400">{order.date}</span>
                                            </div>

                                            <div className="space-y-0.5">
                                                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                    <Utensils className="h-4 w-4 text-orange-600" />
                                                    {order.kitchenName}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                    {order.items}
                                                </p>
                                            </div>
                                        </div>

                                        {/* RIGHT CONTAINER: METRICS & ROUTING ACTION */}
                                        <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                                            <div className="text-left sm:text-right space-y-1">
                                                <span className="text-sm font-black text-slate-900 dark:text-white block">{order.totalPrice}</span>

                                                {/* DYNAMIC PIPELINE STATUS BADGES */}
                                                {order.status === "PREPARING" && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-900/30">
                                                        <Clock className="h-3 w-3 animate-pulse" /> Kitchen Preparing
                                                    </span>
                                                )}
                                                {order.status === "COMPLETED" && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-900/30">
                                                        <CheckCircle2 className="h-3 w-3" /> Arrived / Completed
                                                    </span>
                                                )}
                                            </div>

                                            <button className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </div>

                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </ProtectedRoute>
    );
}