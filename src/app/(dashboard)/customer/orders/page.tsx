"use client";

import { ShoppingBag, Clock } from "lucide-react";

export default function CustomerOrderHistory() {
    const sampleOrders = [
        { id: "FH-2026-A8B9", date: "July 06, 2026", total: 46.48, status: "In the Kitchen" },
        { id: "FH-2026-34F2", date: "July 02, 2026", total: 27.50, status: "Delivered" },
    ];

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Your Food Orders</h1>
                <p className="text-sm text-slate-400">Track active deliveries or review past meal receipts.</p>
            </div>

            <div className="space-y-3">
                {sampleOrders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                        <div className="flex items-start gap-3.5">
                            <div className="p-3 bg-orange-500/10 text-orange-600 rounded-xl shrink-0">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="font-mono font-bold text-slate-900 dark:text-white text-sm">{order.id}</h3>
                                <p className="text-xs text-slate-400 font-medium">Placed on {order.date}</p>
                                <div className="text-sm font-black text-slate-950 dark:text-white pt-1">${order.total.toFixed(2)}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-xl ${order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500 animate-pulse"
                                }`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}