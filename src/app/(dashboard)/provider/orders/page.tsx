"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { ChefHat, CookingPot, Truck, CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";

interface OrderItem {
    mealId: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    deliveryAddress: string;
    contactPhone: string;
    status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
    createdAt: string;
}

export default function ProviderOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchProviderOrders = async (active = true) => {
        setError("");
        try {
            const res = await api.get("/orders");
            const data = res.data?.success ? res.data.orders : res.data;
            if (Array.isArray(data) && active) {
                setOrders(data);
            }
        } catch (err: any) {
            if (active) {
                setError(err.response?.data?.message || "Failed to load kitchen order streams.");
            }
        } finally {
            if (active) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        let active = true;

        const timer = setTimeout(() => {
            fetchProviderOrders(active);
        }, 0);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, []);

    const handleUpdateStatus = async (orderId: string, nextStatus: Order["status"]) => {
        setUpdatingId(orderId);
        try {
            const res = await api.patch(`/orders/${orderId}/status`, { status: nextStatus });
            if (res.status === 200 || res.data?.success) {
                // Update local state arrays seamlessly
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: nextStatus } : o));
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to update target status marker.");
        } finally {
            setUpdatingId(null);
        }
    };

    const getNextActionProps = (status: Order["status"]) => {
        switch (status) {
            case "PLACED":
                return { label: "Accept & Cook", next: "PREPARING" as const, icon: CookingPot, color: "bg-amber-600 hover:bg-amber-700 text-white" };
            case "PREPARING":
                return { label: "Mark as Ready", next: "READY" as const, icon: Truck, color: "bg-purple-600 hover:bg-purple-700 text-white" };
            case "READY":
                return { label: "Dispatched & Delivered", next: "DELIVERED" as const, icon: CheckCircle, color: "bg-emerald-600 hover:bg-emerald-700 text-white" };
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center gap-2 text-slate-400 text-xs">
                <Loader2 className="h-4 w-4 animate-spin text-orange-600" /> Pulling Kitchen Registry Matrix...
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                        <ChefHat className="h-6 w-6 text-orange-600" /> Merchant Kitchen Control Console
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">Fulfill, process, and update states for customer ticket entries.</p>
                </div>
                <button
                    onClick={fetchProviderOrders}
                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer text-slate-600 dark:text-slate-300"
                    title="Refresh Queue"
                >
                    <RefreshCw className="h-4 w-4" />
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 text-red-600 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-xs font-medium">
                    No live incoming tickets detected in your system queue.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {orders.map((order) => {
                        const action = getNextActionProps(order.status);
                        const ActionIcon = action?.icon;

                        return (
                            <div key={order._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">

                                {/* DETAILS GROUP */}
                                <div className="space-y-2 max-w-xl w-full">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <span className="font-mono text-xs font-black text-slate-400">TICKET #{order._id.slice(-8).toUpperCase()}</span>
                                        <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded border uppercase ${order.status === "PLACED" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                            order.status === "PREPARING" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                order.status === "READY" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                                                    order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                        "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="text-xs space-y-0.5 text-slate-800 dark:text-slate-200 font-semibold">
                                        {order.items.map((item, idx) => (
                                            <p key={idx}>
                                                • {item.name} <span className="text-slate-400 font-medium">× {item.quantity}</span>
                                            </p>
                                        ))}
                                    </div>

                                    <p className="text-[11px] text-slate-400 font-medium truncate">
                                        <span className="font-bold text-slate-500">Destination:</span> {order.deliveryAddress} | <span className="font-bold text-slate-500">Phone:</span> {order.contactPhone}
                                    </p>
                                </div>

                                {/* MONEY & TRANSITION CONTROLS */}
                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                                        <p className="text-sm font-black text-slate-950 dark:text-white font-mono">${order.totalAmount.toFixed(2)}</p>
                                    </div>

                                    <div className="w-40 flex justify-end">
                                        {updatingId === order._id ? (
                                            <div className="h-9 flex items-center justify-center text-slate-400 text-xs gap-1.5">
                                                <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-600" /> Syncing...
                                            </div>
                                        ) : action ? (
                                            <button
                                                onClick={() => handleUpdateStatus(order._id, action.next)}
                                                className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${action.color}`}
                                            >
                                                {ActionIcon && <ActionIcon className="h-3.5 w-3.5" />} {action.label}
                                            </button>
                                        ) : (
                                            <span className="text-xs font-semibold text-slate-400 italic">No further actions required</span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}