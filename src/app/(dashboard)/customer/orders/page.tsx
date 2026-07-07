"use client";

import { Order } from "@/src/types/order";
import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { getErrorMessage } from "@/src/lib/error";
import { ClipboardList, Clock, MapPin, XCircle, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useSession } from "@/src/lib/auth-client";


export default function CustomerOrdersPage() {
    const router = useAppRouter();
    const { data: session, isPending } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionPending, setActionPending] = useState<string | null>(null);

    // 🛡️ Simple Route Guard Effect
    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/login");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        if (!session) return;

        const loadOrders = async () => {
            try {
                const res = await api.get("/orders");

                if (Array.isArray(res.data)) {
                    setOrders(res.data);
                } else if (res.data?.orders && Array.isArray(res.data.orders)) {
                    setOrders(res.data.orders);
                } else if (res.data?.data && Array.isArray(res.data.data)) {
                    setOrders(res.data.data);
                } else {
                    setOrders([]);
                    setError("Failed to resolve orders payload structure.");
                }
            } catch (err: unknown) {
                setOrders([]); // Fallback safety on network failure
                setError(getErrorMessage(err, "Could not synchronize with transaction server."));
            } finally {
                setLoading(false);
            }
        };

        void loadOrders();
    }, [session]);

    // Simple loading check text
    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <p className="text-xs font-bold text-slate-400 uppercase animate-pulse">Verifying credentials...</p>
            </div>
        )
    }
    if (!session) return null;

    // Handle order cancellation from the frontend
    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        setActionPending(orderId);
        try {
            const res = await api.patch(`/orders/${orderId}/status`, { status: "CANCELLED" });
            if (res.status === 200 || res.data?.success) {
                // Optimistically update local UI state mapping
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: "CANCELLED" } : o));
            }
        } catch (err: unknown) {
            alert(getErrorMessage(err, "Failed to update state pipeline machine."));
        } finally {
            setActionPending(null);
        }
    };

    // Status Styling Dictionary Mapper
    const getStatusBadge = (status: Order["status"]) => {
        const configurations = {
            PENDING: "bg-slate-500/10 text-slate-600 border-slate-500/20",
            PLACED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            PREPARING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
            READY: "bg-purple-500/10 text-purple-600 border-purple-500/20",
            DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
            CANCELLED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        };
        return (
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${configurations[status]}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Loader2 className="h-5 w-5 animate-spin text-orange-600" /> Hydrating Order Pipelines...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                    <ClipboardList className="h-6 w-6 text-orange-600" /> Your Order Dashboard
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Track live meal preparations and transaction histories.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 text-red-600 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                    <p className="text-sm font-medium text-slate-400">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: Order) => {
                        // TypeScript now natively understands both fields without lint-breaking 'any' casts!
                        const trackingId = (order.id || order._id || "").toString().slice(-8).toUpperCase();

                        return (
                            <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 items-start">

                                {/* META INFO */}
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="font-mono text-xs font-black text-slate-400">
                                            #{trackingId}
                                        </span>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 font-medium">
                                        {/* Type-safe mapping over the prisma relational items query array */}
                                        {order.orderItems?.map((item) => (
                                            <p key={item.id}>
                                                <span className="text-slate-900 dark:text-white font-bold">{item.meal?.name}</span> × {item.quantity}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                {/* LOGISTICS & COST */}
                                <div className="space-y-1 text-xs text-slate-500">
                                    <p className="flex items-center gap-1.5 font-medium">
                                        <Clock className="h-3.5 w-3.5 text-slate-400" /> {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center gap-1.5 font-medium truncate">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {order.deliveryAddress}
                                    </p>
                                    <p className="pt-1 text-sm font-black text-slate-950 dark:text-white">
                                        Total Paid: <span className="text-orange-600 font-mono">${order.totalAmount.toFixed(2)}</span>
                                    </p>
                                </div>

                                {/* ACTION HANDLES */}
                                <div className="flex items-center md:justify-end">
                                    {order.status === "PLACED" ? (
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            disabled={actionPending === order.id}
                                            className="w-full md:w-auto px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 disabled:bg-slate-50 disabled:text-slate-400 text-xs font-bold rounded-xl border border-red-200/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            {actionPending === order.id ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <>
                                                    <XCircle className="h-3.5 w-3.5" /> Cancel Order
                                                </>
                                            )}
                                        </button>
                                    ) : order.status === "DELIVERED" ? (
                                        <span className="text-emerald-600 flex items-center gap-1 text-xs font-bold">
                                            <CheckCircle2 className="h-4 w-4" /> Fulfilled
                                        </span>
                                    ) : order.status === "CANCELLED" ? (
                                        <span className="text-rose-500 text-xs font-bold">Revoked Transaction</span>
                                    ) : (
                                        <span className="text-slate-400 text-xs font-medium italic animate-pulse">Kitchen Progress...</span>
                                    )}
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}