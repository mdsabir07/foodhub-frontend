"use client";

import React, { useState, useEffect } from "react";
import { User as UserIcon, Mail, MapPin, Phone, Save, CheckCircle2, Loader2 } from "lucide-react";
import { authClient } from "../../../../lib/auth-client"; // 💡 Kept explicit relative path to preserve module routing
import { toast } from "react-hot-toast";

export default function CustomerProfile() {
    const { data: session, isPending, error } = authClient.useSession();

    // 📦 Form states
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // ⚡ Synchronize session data on load asynchronously to avoid cascading renders
    useEffect(() => {
        if (!session?.user) return;

        // Load custom delivery address coordinates securely tied to user ID
        const storedPhone = localStorage.getItem(`customer_phone_${session.user.id}`) || "";
        const storedAddress = localStorage.getItem(`customer_address_${session.user.id}`) || "";

        // 💡 DEFER: Push state update to next event loop tick to bypass synchronous render limits
        const timeoutId = setTimeout(() => {
            setFormData({
                name: session.user.name || "",
                email: session.user.email || "",
                phone: storedPhone,
                address: storedAddress,
            });
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [session]);

    // Handle profile update transactions
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Profile name cannot be left blank.");
            return;
        }

        setIsSaving(true);

        try {
            // 1. Update the official user record (Name) on PostgreSQL through Better-Auth
            const { error: updateError } = await authClient.updateUser({
                name: formData.name.trim(),
            });

            if (updateError) {
                toast.error(updateError.message || "Failed to update profile name.");
                setIsSaving(false);
                return;
            }

            // 2. Persist custom metadata (Phone, Address) locally tied to the active user's unique ID
            if (session?.user?.id) {
                localStorage.setItem(`customer_phone_${session.user.id}`, formData.phone.trim());
                localStorage.setItem(`customer_address_${session.user.id}`, formData.address.trim());
            }

            // Trigger success states
            setIsSaved(true);
            toast.success("Profile configurations saved securely!");

            // Auto-clear success banner after 3 seconds
            setTimeout(() => {
                setIsSaved(false);
            }, 3000);
        } catch (err) {
            console.error("❌ PROFILE SAVE ERROR:", err);
            toast.error("An unexpected network write exception occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    // Show clean workspace loading indicator while checking active credentials
    if (isPending) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest animate-pulse">
                    Retrieving profile credentials...
                </p>
            </div>
        );
    }

    // Access fallback block if no active user session exists
    if (error || !session?.user) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto shadow-xl">
                    <UserIcon className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Profile Unavailable</h3>
                    <p className="text-sm text-slate-400 mt-1">Please log in to manage your customer credentials, address registries, and orders.</p>
                </div>
            </div>
        );
    }

    // Derive avatar initials
    const initials = formData.name
        ? formData.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
        : "AJ";

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
                        {initials}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{session.user.name || "App Customer"}</h3>
                        <p className="text-xs text-slate-400 font-mono">Role Status: {(session.user as any).role || "CUSTOMER"} Tier</p>
                    </div>
                </div>

                {/* INPUT GRID */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                                disabled
                                className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl outline-none text-slate-400 dark:text-slate-500 text-sm font-medium cursor-not-allowed select-none"
                                title="Primary account email is locked and managed globally."
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
                                placeholder="+1 (555) 000-0000"
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
                                placeholder="Street Address, City, State, Zip"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl outline-none text-slate-800 dark:text-slate-100 text-sm focus:border-orange-500 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-600/10 hover:bg-orange-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving Changes...</span>
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            <span>Save Profile Configurations</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}