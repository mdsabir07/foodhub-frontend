"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { useAppRouter } from "@/src/hooks/useAppRouter";

export default function LoginPage() {
    const { login } = useAuth();
    const { navigate } = useAppRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (email === "provider@foodhub.com") {
                login({ id: "p1", email: "provider@foodhub.com", name: "Gourmet Bistro", role: "PROVIDER" });
                navigate("/provider/dashboard");
            } else if (email === "admin@foodhub.com") {
                login({ id: "a1", email: "admin@foodhub.com", name: "System Admin", role: "ADMIN" });
                navigate("/admin");
            } else {
                login({ id: "c1", email: email || "customer@foodhub.com", name: "Alex Johnson", role: "CUSTOMER" });
                navigate("/meals");
            }
        } catch (err) {
            setErrorMessage("Invalid credentials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col justify-center px-6 py-12 lg:col-span-5 lg:px-12 xl:px-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                <div className="mx-auto w-full max-w-sm">
                    <div className="flex items-center gap-2 text-xl font-bold text-orange-600 mb-8">
                        <UtensilsCrossed className="h-6 w-6" />
                        <span>FoodHub</span>
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-semibold text-orange-600 dark:text-orange-400 hover:underline">Sign up today</Link>
                    </p>

                    {errorMessage && (
                        <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail className="h-5 w-5" /></span>
                                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between"><label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label></div>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock className="h-5 w-5" /></span>
                                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm" />
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-medium text-white hover:bg-orange-500 disabled:bg-orange-600/70 shadow-lg shadow-orange-600/10 cursor-pointer transition-all">
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><span>Sign In</span><ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></>}
                        </button>
                    </form>

                    <div className="mt-8 rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-800/60">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sandbox Test User:</h4>
                        <p className="text-xs text-slate-500">💡 Use <code className="text-orange-600 font-mono">provider@foodhub.com</code> to check out the Provider interface.</p>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex lg:col-span-7 bg-radial from-orange-600/10 via-transparent to-transparent items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <div className="relative inline-flex items-center justify-center mb-8 h-24 w-24 rounded-2xl bg-orange-600 text-white shadow-xl shadow-orange-600/20"><UtensilsCrossed className="h-12 w-12" /></div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Savor the ease of local dining</h3>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Gain complete access to premium restaurant menus and live delivery updates on a single, responsive canvas.</p>
                </div>
            </div>
        </div>
    );
}