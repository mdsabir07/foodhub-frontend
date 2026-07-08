"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DollarSign,
    ShoppingBag,
    Utensils,
    TrendingUp,
    Plus,
    CheckCircle,
    Clock,
    XCircle,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";


export default function ProviderDashboard() {
    const [products, setProducts] = useState<{
        id: string;
        name: string;
        category: string;
        price: number;
        ordersCount: number;
        isAvailable: boolean;
    }[]>([]);
    const [orders, setOrders] = useState<{
        id: string;
        customer: string;
        items: string;
        total: number;
        status: string;
        time: string;
    }[]>([]);

    const [dbCategories, setDbCategories] = useState<{
        id: string;
        name: string;
    }[]>([]);
    // Form modal state for adding a new dish
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDish, setNewDish] = useState({ name: "", categoryId: "", price: "", description: "" });
    const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

    // Toggle dish availability switch
    const toggleAvailability = (id: string) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
    };

    // Update order workflow status flags
    const updateOrderStatus = (id: string, nextStatus: "preparing" | "completed" | "cancelled") => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
    };

    // 📥 Step 2: Fetch Live Dashboard Data from your Backend
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // 🔐 Better-Auth handles session cookies automatically via axios/fetch credentials.
                const fetchOptions = {
                    credentials: "include" as const, // Passes Better-Auth cookies safely to port 4000
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                // --- FETCH SYSTEM CATEGORIES FOR THE MODAL SELECTOR ---
                const catRes = await fetch("http://localhost:400/api/categories", fetchOptions);
                const catJson = await catRes.json();
                if (catJson.success && catJson.data.length > 0) {
                    setDbCategories(catJson.data);
                    // Automatically set the form's default category selection to the first database item's ID
                    setNewDish(prev => ({ ...prev, categoryId: catJson.data[0].id }));
                }

                // 1. FETCH THE PROVIDER'S LISTED MEALS FROM POSTGRESQL
                const mealsRes = await fetch("http://localhost:4000/api/meals", fetchOptions);
                const mealsJson = await mealsRes.json();

                if (mealsJson.success) {
                    // Re-map the raw database fields to match your UI's expected product layout
                    const liveMeals = mealsJson.data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        category: item.category?.name || "General",
                        price: item.price,
                        ordersCount: item._count?.orders || 0, // Relational counting via Prisma
                        isAvailable: true
                    }));
                    setProducts(liveMeals);
                }

                // 2. FETCH ACTIVE INBOUND KITCHEN TICKETS FROM POSTGRESQL
                const ordersRes = await fetch("http://localhost:4000/api/provider/orders", fetchOptions);
                const ordersJson = await ordersRes.json();

                if (ordersJson.success) {
                    const liveOrders = ordersJson.data.map((ord: any) => ({
                        id: ord.id.substring(0, 8).toUpperCase(), // Clean short string ID layout
                        customer: ord.customer?.name || "App Customer",
                        // Compile individual food details into a readable list string
                        items: ord.items?.map((i: any) => `${i.quantity}x ${i.meal?.name}`).join(", ") || "Food Order",
                        total: ord.totalAmount,
                        status: ord.status, // "pending" | "preparing" | "completed"
                        time: "Just now"
                    }));
                    setOrders(liveOrders);
                }

            } catch (error) {
                console.error("❌ FRONTEND SYNC ERROR:", error);
            }
        };

        loadDashboardData();
    }, []);

    // Handle saving a brand new menu entry
    const handleAddDish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDish.name || !newDish.price || !newDish.categoryId) return;
        setErrorFeedback(null); // Clear any old errors on resubmit

        try {
            const response = await fetch("http://localhost:4000/api/meals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Credentials option can be included if required by your auth layout
                body: JSON.stringify({
                    name: newDish.name,
                    description: newDish.description || "Freshly cooked gourmet dish.",
                    price: newDish.price, // Handled flawlessly by our patched backend float converter!
                    categoryId: newDish.categoryId,
                    image: "" // Ready for our upcoming ImgBB upload integration!
                }),
            });

            const json = await response.json();
            if (json.success) {
                // Find the name of the category from our local state list to display in the table row
                const categoryName = dbCategories.find(c => c.id === json.data.categoryId)?.name || "General";
                const dishEntry = {
                    id: json.data.id,
                    name: json.data.name,
                    category: categoryName,
                    price: json.data.price,
                    ordersCount: 0,
                    isAvailable: true
                };
                setProducts(prev => [dishEntry, ...prev]);
                // Clear out form inputs and reset default category selector
                setNewDish({ name: "", categoryId: dbCategories[0]?.id || "", price: "", description: "" });
                setIsModalOpen(false); // Close the modal after successful submission
            } else {
                setErrorFeedback(json.error || "Failed to create meal record. Please check details.");
            }
        } catch (error: any) {
            console.error("Network write exception:", error);
            setErrorFeedback("Could not connect to the database server. Check port 4000.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200 pb-12">

            {/* TOP HEADER STATUS BANNER */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Gourmet Bistro Hub
                        </div>
                        <h1 className="text-2xl font-black tracking-tight mt-1">Merchant Control Panel</h1>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white font-semibold text-sm rounded-xl hover:bg-orange-500 cursor-pointer shadow-lg shadow-orange-600/10 transition-all self-start sm:self-center"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add New Dish</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

                {/* KEY PERFORMANCE INDICATORS SECTION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Revenue Today</p>
                            <h3 className="text-2xl font-black">$4,852.20</h3>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                                <TrendingUp className="h-3 w-3" />
                                <span>+12.4% vs yesterday</span>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Kitchen Tickets</p>
                            <h3 className="text-2xl font-black">
                                {orders.filter(o => o.status === "pending" || o.status === "any" || o.status === "preparing").length} Items
                            </h3>
                            <p className="text-[11px] text-slate-400">2 tickets pending review</p>
                        </div>
                        <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Listed Menu Items</p>
                            <h3 className="text-2xl font-black">{products.length} Dishes</h3>
                            <p className="text-[11px] text-slate-400">{products.filter(p => !p.isAvailable).length} temporarily sold out</p>
                        </div>
                        <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Utensils className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Average Rating</p>
                            <h3 className="text-2xl font-black">4.88 ⭐</h3>
                            <p className="text-[11px] text-slate-400">Based on last 500 orders</p>
                        </div>
                        <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>

                </div>

                {/* REVENUE MAIN CONTENT INTERACTION WORKSPACE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT CONTAINER: ACTIVE LIVE KITCHEN TICKETS QUEUE */}
                    <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
                        <div>
                            <h2 className="font-bold text-lg">Inbound Active Orders</h2>
                            <p className="text-xs text-slate-400">Live request stream coming into the kitchen pipeline.</p>
                        </div>

                        <div className="space-y-3">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                                            {order.id}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs font-semibold">
                                            <Clock className="h-3 w-3 text-slate-400" />
                                            <span className="text-slate-400">{order.time}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold">{order.customer}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{order.items}</p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
                                        <span className="text-sm font-black">${order.total.toFixed(2)}</span>

                                        {/* Render contextual response buttons matching ticket lifecycle */}
                                        {order.status === "pending" && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, "preparing")}
                                                className="px-2.5 py-1 text-xs font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-500 cursor-pointer transition-all"
                                            >
                                                Accept Order
                                            </button>
                                        )}
                                        {order.status === "preparing" && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, "completed")}
                                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 cursor-pointer transition-all"
                                            >
                                                <CheckCircle className="h-3 w-3" />
                                                <span>Ready for Pickup</span>
                                            </button>
                                        )}
                                        {order.status === "completed" && (
                                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                                <CheckCircle className="h-3.5 w-3.5" /> Dispatched
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT CONTAINER: INTERACTIVE MENU INVENTORY MANAGEMENT DATAGRID */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-lg">Menu Catalog Listing</h2>
                                <p className="text-xs text-slate-400">Control individual catalog listing active statuses and prices.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-50/70 dark:bg-slate-950/40 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-semibold text-xs">
                                        <th className="p-4">Dish Details</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Base Price</th>
                                        <th className="p-4">Lifetime Orders</th>
                                        <th className="p-4 text-right">Status Toggle</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                                    {products.map((dish) => (
                                        <tr key={dish.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors">
                                            <td className="p-4">
                                                <span className="font-bold block text-slate-900 dark:text-white">{dish.name}</span>
                                                <span className="text-xs text-slate-400 block font-mono mt-0.5">{dish.id}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[11px] rounded font-bold text-slate-500 dark:text-slate-400">
                                                    {dish.category}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-slate-900 dark:text-white">${dish.price.toFixed(2)}</td>
                                            <td className="p-4 text-slate-400 font-mono">{dish.ordersCount}</td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => toggleAvailability(dish.id)}
                                                    className="inline-flex items-center justify-end cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                                >
                                                    {dish.isAvailable ? (
                                                        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                                                            <span>Active</span>
                                                            <ToggleRight className="h-6 w-6 text-emerald-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                            <span>Hidden</span>
                                                            <ToggleLeft className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* OVERLAY COMPONENT DIALOG MODAL BOX */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black z-40" />

                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold">List New Food Item</h3>
                                    <button onClick={() => { setIsModalOpen(false); setErrorFeedback(null); }} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><XCircle className="h-5 w-5 text-slate-400" /></button>
                                </div>

                                <AnimatePresence>
                                    {errorFeedback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -1 }}
                                            className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2"
                                        >
                                            <XCircle className="h-4 w-4 shrink-0" />
                                            <span>{errorFeedback}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleAddDish} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 block mb-1">Dish Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={newDish.name}
                                            onChange={e => setNewDish({ ...newDish, name: e.target.value })}
                                            placeholder="e.g. Crispy Honey Garlic Wings"
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 block mb-1">Category Group</label>
                                            <select
                                                value={newDish.categoryId}
                                                onChange={e => setNewDish({ ...newDish, categoryId: e.target.value })}
                                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                                            >
                                                {dbCategories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 block mb-1">Base Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={newDish.price}
                                                onChange={e => setNewDish({ ...newDish, price: e.target.value })}
                                                placeholder="14.99"
                                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-orange-500 transition-colors text-center shadow-lg shadow-orange-600/10"
                                        >
                                            Publish Item
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )
                }
            </AnimatePresence >

        </div >
    );
}