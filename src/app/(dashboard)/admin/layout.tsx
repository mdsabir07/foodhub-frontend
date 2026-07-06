"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/src/components/shared/ProtectedRoute";
import { LayoutDashboard, Users, ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { name: "Overview Insights", path: "/admin", icon: LayoutDashboard },
        { name: "Manage Directory", path: "/admin/users", icon: Users },
    ];

    return (
        <ProtectedRoute allowedRoles={["Admin"]}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">

                {/* 🎛️ SIDEBAR NAV PANEL */}
                <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-5 shrink-0">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />
                            <span className="font-black text-lg text-slate-950 dark:text-white tracking-tight">
                                Admin<span className="text-red-500">HQ</span>
                            </span>
                        </div>

                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive
                                                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 hidden md:block">
                        <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all">
                            <ArrowLeft className="h-3.5 w-3.5" /> Back to Marketplace
                        </Link>
                    </div>
                </aside>

                {/* 🥞 CONTENT WORKSPACE */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>

            </div>
        </ProtectedRoute>
    );
}