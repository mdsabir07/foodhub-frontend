"use client";

import { useEffect, useState } from "react";
import {
    DollarSign,
    ShoppingBag,
    Utensils,
    TrendingUp,
    Plus,
    CheckCircle,
    Clock,
    ToggleLeft,
    ToggleRight,
    Edit3,
    Trash2,
} from "lucide-react";
import AddDishModal from "@/src/components/AddDishModal";
import EditDishModal from "@/src/components/EditDishModal";
import toast from "react-hot-toast";

export default function ProviderDashboard() {
    const [products, setProducts] = useState<{
        id: string;
        name: string;
        category: string;
        categoryId?: string; // Stored to map category IDs to editing forms
        price: number;
        ordersCount: number;
        isAvailable: boolean;
        description?: string;
        image?: string;
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

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDish, setSelectedDish] = useState<any>(null);

    // Toggle dish availability switch
    const toggleAvailability = (id: string) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
    };

    // Update order workflow status flags using correct Prisma OrderStatus Enums
    const updateOrderStatus = (id: string, nextStatus: "PREPARING" | "READY" | "DELIVERED" | "CANCELED") => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
    };

    // Fetch Live Dashboard Data from your Backend
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const fetchOptions = {
                    credentials: "include" as const,
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                // FETCH SYSTEM CATEGORIES FOR THE MODAL SELECTOR
                const catRes = await fetch("http://localhost:4000/api/categories", fetchOptions);
                const catJson = await catRes.json();
                if (catJson.success && catJson.data?.length > 0) {
                    setDbCategories(catJson.data);
                } else {
                    setDbCategories([]);
                }

                // FETCH THE PROVIDER'S LISTED MEALS FROM POSTGRESQL
                const mealsRes = await fetch("http://localhost:4000/api/meals", fetchOptions);
                const mealsJson = await mealsRes.json();

                if (mealsJson.success) {
                    const liveMeals = mealsJson.data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        category: item.category?.name || "General",
                        categoryId: item.category?.id || item.categoryId,
                        price: item.price,
                        ordersCount: item._count?.orders || 0,
                        isAvailable: true,
                        description: item.description || "",
                        image: item.image || "",
                    }));
                    setProducts(liveMeals);
                }

                // FETCH ACTIVE INBOUND KITCHEN TICKETS FROM POSTGRESQL
                const ordersRes = await fetch("http://localhost:4000/api/provider/orders", fetchOptions);
                const ordersJson = await ordersRes.json();

                if (ordersJson.success) {
                    const liveOrders = ordersJson.data.map((ord: any) => ({
                        id: ord.id.substring(0, 8).toUpperCase(),
                        customer: ord.customer?.name || "App Customer",
                        items: ord.items?.map((i: any) => `${i.quantity}x ${i.meal?.name}`).join(", ") || "Food Order",
                        total: ord.totalAmount,
                        status: ord.status,
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

    // Callback used when the modal succeeds in saving to backend
    const handleDishAdded = (dishEntry: any) => {
        setProducts(prev => [dishEntry, ...prev]);
    };

    // Callback used when a dish is successfully edited and updated
    const handleDishUpdated = (updatedEntry: any) => {
        setProducts(prev => prev.map(p => p.id === updatedEntry.id ? { ...p, ...updatedEntry } : p));
    };

    // Triggers the Edit Modal workflow
    const handleEditClick = (dish: any) => {
        setSelectedDish(dish);
        setIsEditModalOpen(true);
    };

    // Deletes the dish from database and synchronizes UI state
    const handleDeleteDish = async (id: string) => {
        // We call it "Archive/Remove" to the user, not "Delete"
        const confirmToast = toast.loading("Processing request...");

        try {
            // Send a PUT request instead of DELETE to softly archive it
            const res = await fetch(`http://localhost:4000/api/meals/${id}`, {
                method: "PUT", // Firing update instead of deletion
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isAvailable: false, // Turn off visibility
                    // Optional: if your backend has an 'isDeleted' field, pass it here
                }),
                credentials: "include"
            });

            const json = await res.json();

            if (json.success) {
                // Remove it from the local state list immediately so the merchant sees it disappear
                setProducts(prev => prev.filter(p => p.id !== id));
                toast.success("Dish successfully archived and removed from menu!", { id: confirmToast });
            } else {
                toast.error(json.error || "Failed to remove item.", { id: confirmToast });
            }
        } catch (err) {
            console.error("Archive error:", err);
            toast.error("Network communication failure.", { id: confirmToast });
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
                        onClick={() => setIsAddModalOpen(true)}
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
                                {orders.filter(o => o.status === "PLACED" || o.status === "PREPARING").length} Items
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

                                        {/* 1. PLACED -> Action: Accept Order (Moves to PREPARING) */}
                                        {order.status === "PLACED" && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, "PREPARING")}
                                                className="px-2.5 py-1 text-xs font-bold bg-orange-600 text-white rounded-lg hover:bg-orange-500 cursor-pointer transition-all"
                                            >
                                                Accept Order
                                            </button>
                                        )}

                                        {/* 2. PREPARING -> Action: Ready for Pickup (Moves to READY) */}
                                        {order.status === "PREPARING" && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, "READY")}
                                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 cursor-pointer transition-all"
                                            >
                                                <CheckCircle className="h-3 w-3" />
                                                <span>Ready for Pickup</span>
                                            </button>
                                        )}

                                        {/* 3. READY -> Action: Complete/Deliver Order (Moves to DELIVERED) */}
                                        {order.status === "READY" && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer transition-all"
                                            >
                                                <span>Mark Delivered</span>
                                            </button>
                                        )}

                                        {/* 4. DELIVERED -> Static Status View */}
                                        {order.status === "DELIVERED" && (
                                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                                <CheckCircle className="h-3.5 w-3.5" /> Dispatched & Delivered
                                            </span>
                                        )}

                                        {/* 5. CANCELED -> Static Status View */}
                                        {order.status === "CANCELED" && (
                                            <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                                                Cancelled
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
                                        <th className="p-4">Status Toggle</th>
                                        <th className="p-4 text-right">Actions</th>
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
                                            <td className="p-4">
                                                <button
                                                    onClick={() => toggleAvailability(dish.id)}
                                                    className="inline-flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
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
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2.5">
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => handleEditClick(dish)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                                                        title="Edit Dish Information"
                                                    >
                                                        <Edit3 className="h-4.5 w-4.5" />
                                                    </button>
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDeleteDish(dish.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/25 rounded-lg cursor-pointer transition-colors"
                                                        title="Delete Dish"
                                                    >
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* 🛠️ INTEGRATED MODAL: Receives system state options & passes back structural payloads */}
            <AddDishModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                dbCategories={dbCategories}
                setDbCategories={setDbCategories}
                onDishAdded={handleDishAdded}
            />

            {/* 📝 INTEGRATED EDIT DISH MODAL */}
            {selectedDish && (
                <EditDishModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedDish(null);
                    }}
                    dish={selectedDish}
                    dbCategories={dbCategories}
                    setDbCategories={setDbCategories}
                    onDishUpdated={handleDishUpdated}
                />
            )}
        </div>
    );
}