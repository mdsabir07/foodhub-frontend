"use client";

import { useState } from "react";
import { ShieldCheck, Ban, UserCheck } from "lucide-react";

export default function AdminUserManagement() {
    const [users, setUsers] = useState([
        { id: "1", name: "John Doe", email: "john@customer.com", role: "Customer", status: "Active" },
        { id: "2", name: "Chef Alex Rivera", email: "alex@kitchen.com", role: "Provider", status: "Active" },
        { id: "3", name: "Malicious Actor", email: "spam@bot.com", role: "Customer", status: "Suspended" },
    ]);

    const toggleStatus = (id: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">User Administration Directory</h1>
                <p className="text-sm text-slate-400">Moderate platform role profiles or suspend accounts violating terms.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <th className="p-4">User Info</th>
                            <th className="p-4">Account Role</th>
                            <th className="p-4">Current Status</th>
                            <th className="p-4 text-right">Moderation Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-800">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-300">
                                <td className="p-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                                    <div className="text-xs text-slate-400 font-mono">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${user.role === "Provider" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md ${user.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => toggleStatus(user.id)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${user.status === "Active"
                                                ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                                                : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                            }`}
                                    >
                                        {user.status === "Active" ? <Ban className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                                        {user.status === "Active" ? "Suspend Account" : "Reactivate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}