"use client";

import { Users, ShoppingBag, DollarSign, Store, TrendingUp } from "lucide-react";

export default function AdminDashboardOverview() {
    const metrics = [
        { title: "Total Platform Users", value: "1,248 Accounts", sub: "Customers & Providers", icon: Users, color: "text-blue-500 bg-blue-500/10" },
        { title: "Active Kitchen Vendors", value: "42 Providers", sub: "Locally vetted merchants", icon: Store, color: "text-amber-500 bg-amber-500/10" },
        { title: "Gross Orders Processed", value: "3,890 Orders", sub: "System wide lifetime orders", icon: ShoppingBag, color: "text-emerald-500 bg-emerald-500/10" },
        { title: "Gross Market GMV", value: "$84,240.00", sub: "Invoiced processing totals", icon: DollarSign, color: "text-purple-500 bg-purple-500/10" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">HQ Console Summary</h1>
                <p className="text-sm text-slate-400 mt-0.5">Real-time macro metrics covering directory distribution balances.</p>
            </div>

            {/* METRICS STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m) => (
                    <div key={m.title} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
                            <h3 className="text-xl font-black text-slate-950 dark:text-white">{m.value}</h3>
                            <p className="text-[11px] text-slate-400">{m.sub}</p>
                        </div>
                        <div className={`p-3 rounded-xl shrink-0 ${m.color}`}>
                            <m.icon className="h-5 w-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* AUDIT LOG TRAIL */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <h2 className="font-extrabold text-sm text-slate-950 dark:text-white uppercase tracking-wider">Critical Audit Stream Logs</h2>
                </div>
                <div className="space-y-3 text-xs font-medium">
                    <div className="flex justify-between items-center text-slate-500 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                        <span>New Restaurant Registration Request: <b className="text-slate-800 dark:text-slate-200">"Taco Del Sol"</b></span>
                        <span className="font-mono text-[10px]">Just Now</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                        <span>User Report Filed: Review Flagged on Order #FH-99A8</span>
                        <span className="font-mono text-[10px]">12 Mins Ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}