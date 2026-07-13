"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Shield,
    UserX,
    Search,
    Filter,
    ToggleLeft,
    ToggleRight,
    Loader2,
    CheckCircle,
    XCircle,
    UserCheck,
    Lock
} from "lucide-react";
import { adminService, AdminUser } from "@/src/services/adminService";
import { toast } from "react-hot-toast";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<"ALL" | "CUSTOMER" | "PROVIDER" | "ADMIN">("ALL");

    useEffect(() => {
        const fetchUserDirectory = async () => {
            try {
                setLoading(true);
                const result = await adminService.getAllUsers();
                if (result.success && result.data) {
                    setUsers(result.data);
                } else {
                    toast.error(result.error || "Could not synchronize admin database logs.");
                }
            } catch (error) {
                console.error("❌ FRONTEND RECOVERY FAILURE:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDirectory();
    }, []);

    const handleToggleSuspension = async (userId: string, currentStatus: boolean) => {
        const targetNewStatus = !currentStatus;

        try {
            const result = await adminService.toggleUserSuspension(userId, targetNewStatus);

            if (result.success) {
                setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, isSuspended: targetNewStatus } : u))
                );

                if (targetNewStatus) {
                    toast.success("User account successfully suspended.", { icon: "🛡️" });
                } else {
                    toast.success("User account has been reactivated.", { icon: "✅" });
                }
            } else {
                toast.error(result.error || "Database authorization rejected the state change.");
            }
        } catch (error: unknown) {
            toast.error("Network write exception occurred.");
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200 pb-12">

            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                        Root System Admin Mode
                    </div>
                    <h1 className="text-2xl font-black tracking-tight mt-1">Global System Registry</h1>
                    <p className="text-xs text-slate-400 mt-1">Manage network accounts, suspension statuses, and roles securely.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

                {/* KPI METRIC CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Registered Users</p>
                            <h3 className="text-2xl font-black">{loading ? "..." : users.length}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Customers</p>
                            <h3 className="text-2xl font-black">{loading ? "..." : users.filter(u => u.role === "CUSTOMER").length}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Service Providers</p>
                            <h3 className="text-2xl font-black">{loading ? "..." : users.filter(u => u.role === "PROVIDER").length}</h3>
                        </div>
                        <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                            <Shield className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Suspended Accounts</p>
                            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400">{loading ? "..." : users.filter(u => u.isSuspended).length}</h3>
                        </div>
                        <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
                            <UserX className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* SEARCH AND FILTER */}
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, or unique user ID..."
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-red-500 transition-all shadow-xs"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                        {(["ALL", "CUSTOMER", "PROVIDER", "ADMIN"] as const).map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer transition-all border ${roleFilter === role
                                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 border-slate-900 dark:border-slate-100 shadow-md"
                                        : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* DATA TABLE */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3">
                            <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
                            <p className="text-sm text-slate-400 font-medium">Opening master database connections...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-16 p-8 max-w-md mx-auto">
                            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                            <h3 className="font-bold text-lg">No matching profiles</h3>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-50/70 dark:bg-slate-950/40 text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-wider">
                                        <th className="p-4 pl-6">Profile details</th>
                                        <th className="p-4">Classification</th>
                                        <th className="p-4">Verification</th>
                                        <th className="p-4">Enrollment date</th>
                                        <th className="p-4 text-right pr-6">Status Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors">
                                            <td className="p-4 pl-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-950 dark:text-white text-sm">{user.name || "Anonymous User"}</span>
                                                    <span className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</span>
                                                    <span className="text-[10px] text-slate-400/80 font-mono mt-0.5">UID: {user.id}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-lg border ${user.role === "ADMIN"
                                                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                                                        : user.role === "PROVIDER"
                                                            ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                                                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {user.emailVerified ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
                                                        <CheckCircle className="h-3.5 w-3.5" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                                                        <XCircle className="h-3.5 w-3.5" /> Unverified
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-xs text-slate-400 font-mono">
                                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                {user.role === "ADMIN" ? (
                                                    <span className="text-xs text-slate-400/70 inline-flex items-center gap-1 font-semibold select-none">
                                                        <Lock className="h-3 w-3" /> System Lock
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleToggleSuspension(user.id, user.isSuspended)}
                                                        className="inline-flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                                    >
                                                        {user.isSuspended ? (
                                                            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-black">
                                                                <span>SUSPENDED</span>
                                                                <ToggleLeft className="h-6 w-6 text-rose-500" />
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-black">
                                                                <span>ACTIVE</span>
                                                                <ToggleRight className="h-6 w-6 text-emerald-500" />
                                                            </div>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}