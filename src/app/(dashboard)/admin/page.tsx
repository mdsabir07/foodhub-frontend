"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp,
    ShieldAlert,
    DollarSign,
    ShoppingBag,
    Activity,
    ArrowRight,
    Users
} from "lucide-react";
import Link from "next/link";
import { adminService, AdminUser } from "@/src/services/adminService";

export default function AdminOverviewPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProviders: 0,
        totalCustomers: 0,
        suspendedCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await adminService.getAllUsers();
                if (res.success && res.data) {
                    const users = res.data;
                    setStats({
                        totalUsers: users.length,
                        totalProviders: users.filter(u => u.role === "PROVIDER").length,
                        totalCustomers: users.filter(u => u.role === "CUSTOMER").length,
                        suspendedCount: users.filter(u => u.isSuspended).length,
                    });
                }
            } catch (error) {
                console.error("Failed to load overview analytics stats.", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* WELCOME BLOCK */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl relative overflow-hidden shadow-xs">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="relative space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider">
                            <Activity className="h-3 w-3 animate-pulse" /> Live Administration
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Overview Insights</h1>
                        <p className="text-sm text-slate-400 max-w-xl">
                            Monitor user registrations, system-wide transaction activity, merchant accounts status, and enforce secure account guard guidelines.
                        </p>
                    </div>
                </div>

                {/* METRIC BOXES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Revenue</p>
                        <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">$14,240.50</h3>
                        <div className="flex items-center gap-1 text-xs text-emerald-500 font-bold mt-1">
                            <TrendingUp className="h-3.5 w-3.5" /> +8.4% this week
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active System Orders</p>
                        <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">188 Placed</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-bold mt-1">
                            Average dispatch 18 min
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Service Providers</p>
                        <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">
                            {loading ? "..." : stats.totalProviders} Kitchens
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-orange-500 font-bold mt-1">
                            Active merchant gateways
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Locked Accounts</p>
                        <h3 className="text-3xl font-black mt-2 text-red-600 dark:text-red-400">
                            {loading ? "..." : stats.suspendedCount} Users
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-bold mt-1">
                            Suspensions enforced
                        </div>
                    </div>
                </div>

                {/* LINK DIRECTORY ROUTE */}
                <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800">
                    <div className="space-y-1">
                        <h4 className="font-black text-slate-950 dark:text-white">Perform Security Audits</h4>
                        <p className="text-xs text-slate-400">View and check all user classifications or lift account suspensions instantly.</p>
                    </div>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-red-500 shadow-lg shadow-red-600/10 cursor-pointer transition-all"
                    >
                        <span>Manage Directory</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

            </div>
        </div>
    );
}