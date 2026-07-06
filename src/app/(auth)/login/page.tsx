"use client";

import React, { useState } from "react";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { authClient } from "@/src/lib/auth-client";
import { Mail, Lock, AlertCircle, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { getErrorMessage } from "@/src/lib/error";

export default function LoginPage() {
    const router = useAppRouter();

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // UI Feedback States
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setPending(true);

        try {
            // REFACTORED: Authenticating user through Better Auth client mapping channel
            const { data, error: authError } = await authClient.signIn.email({
                email,
                password,
            });

            if (authError) {
                setError(authError.message || "Invalid email or password configuration.");
                return;
            }

            // Route dynamically based on user role parameter inside the session data payload
            const user = data?.user as { role?: string } | undefined;
            const userRole = user?.role?.toUpperCase();

            if (userRole === "PROVIDER") {
                router.replace("/provider/orders");
            } else {
                router.replace("/customer/orders");
            }

        } catch (err: unknown) {
            setError(getErrorMessage(err, "A critical system authentication pipeline timeout occurred."));
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-6 shadow-sm">

                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                        <KeyRound className="h-6 w-6 text-orange-600" /> Secure Sign In
                    </h2>
                    <p className="text-xs text-slate-400">Welcome back! Authenticate to access your FoodHub terminal.</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-600 rounded-xl text-xs font-semibold">
                        <AlertCircle className="h-4 w-4 shrink-0" /> <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* EMAIL INPUT */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Registered Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={pending}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl outline-none text-slate-900 dark:text-slate-100"
                                placeholder="name@domain.com"
                                required
                            />
                        </div>
                    </div>

                    {/* PASSWORD INPUT */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Account Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={pending}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl outline-none text-slate-900 dark:text-slate-100"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={pending || !email || !password}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Access Account Console"}
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
                    <span>New to the platform? </span>
                    <Link
                        href="/register"
                        className="text-orange-600 hover:underline transition-all cursor-pointer font-bold"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}