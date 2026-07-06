"use client";

import { useState } from "react";
import { User, Mail, MapPin, Phone, Save, CheckCircle2 } from "lucide-react";

export default function CustomerProfile() {
    // Local state initialized with dummy user data
    const [formData, setFormData] = useState({
        name: "Alex Johnson",
        email: "alex.johnson@foodhub.com",
        phone: "+1 (555) 234-5678",
        address: "742 Evergreen Terrace, Springfield",
    });

    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaved(true);

        // Auto-clear success banner after 3 seconds
        setTimeout(() => {
            setIsSaved(false);
        }, 300);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Profile Management</h1>
                <p className="text-sm text-slate-400">Update your account credentials, contact coordinates, and checkout delivery address.</p>
            </div>

            {isSaved && (
                <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-sm font-semibold animate-fade-in">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Profile records updated successfully!</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">

                {/* 📷 AVATAR PLACEHOLDER ROW */}
                <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div className="h-16 w-16 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md shadow-orange-500/10">
                        AJ
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Account Identifier</h3>
                        <p className="text-xs text-slate-400 font-mono">Role Status: Customer Tier</p>
                    </div>
                </div>

                {/* INPUT GRID */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl outline-none text-slate-800 dark:text-slate-100 text-sm focus:border-orange-500 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl outline-none text-slate-800 dark:text-slate-100 text-sm focus:border-orange-500 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl outline-none text-slate-800 dark:text-slate-100 text-sm focus:border-orange-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Default Delivery Address (COD Drop-off)</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl outline-none text-slate-800 dark:text-slate-100 text-sm focus:border-orange-500 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-600/10 hover:bg-orange-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Save className="h-4 w-4" /> Save Profile Configurations
                </button>
            </form>
        </div>
    );
}