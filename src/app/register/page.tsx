"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/api";
import { User, Mail, Lock, Store, Utensils, AlertCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();

    // Form Field States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");

    // Status States
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    // Live Password Validation Flags
    const isConfirmFieldDirty = confirmPassword.length > 0;
    const passwordsMatch = password === confirmPassword;
    const isPasswordLongEnough = password.length >= 6;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Fallback sanity checks before firing payload
        if (!isPasswordLongEnough) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (!passwordsMatch) {
            setError("Passwords do not match.");
            return;
        }

        setPending(true);

        try {
            const res = await api.post("/auth/register", { name, email, password, role });

            if (res.data?.success || res.status === 201 || res.status === 200) {
                router.push("/login");
            } else {
                setError(res.data?.message || "Registration failed. Please check your details.");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "A network error occurred during account creation.");
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-6 shadow-sm">

                <div>
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Create Account</h2>
                    <p className="text-xs text-slate-400 mt-1">Join the FoodHub ecosystem marketplace platform.</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-600 rounded-xl text-xs font-semibold animate-shake">
                        <AlertCircle className="h-4 w-4 shrink-0" /> <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* ROLE SELECTOR CAPSULES */}
                    <div className="grid grid-cols-2 gap-3 pb-2">
                        <button
                            type="button"
                            onClick={() => setRole("CUSTOMER")}
                            disabled={pending}
                            className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${role === "CUSTOMER"
                                ? "border-orange-500 bg-orange-500/5 text-orange-600"
                                : "border-slate-200 dark:border-slate-800 text-slate-400"
                                }`}
                        >
                            <Utensils className="h-4 w-4" /> Sign Up to Order
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("PROVIDER")}
                            disabled={pending}
                            className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${role === "PROVIDER"
                                ? "border-orange-500 bg-orange-500/5 text-orange-600"
                                : "border-slate-200 dark:border-slate-800 text-slate-400"
                                }`}
                        >
                            <Store className="h-4 w-4" /> Register Kitchen
                        </button>
                    </div>

                    {/* FULL NAME */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Full Identity Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={pending} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl outline-none" placeholder="Jane Doe" required />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={pending} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl outline-none" placeholder="name@domain.com" required />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={pending} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl outline-none" placeholder="••••••••" required />
                        </div>
                        {password && !isPasswordLongEnough && (
                            <p className="text-[11px] text-red-500 font-medium pt-0.5">Password must be at least 6 characters long.</p>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD WITH INSTANT LIVE FEEDBACK MATCHING */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={pending}
                                className={`w-full pl-11 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border text-sm rounded-xl outline-none transition-all ${isConfirmFieldDirty
                                    ? passwordsMatch
                                        ? "border-emerald-500 focus:border-emerald-500"
                                        : "border-red-500 focus:border-red-500"
                                    : "border-slate-200 dark:border-slate-800"
                                    }`}
                                placeholder="••••••••"
                                required
                            />
                            {isConfirmFieldDirty && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {passwordsMatch ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                </div>
                            )}
                        </div>
                        {isConfirmFieldDirty && !passwordsMatch && (
                            <p className="text-[11px] text-red-500 font-medium pt-0.5 animate-pulse">Passwords do not match yet.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={pending || (isConfirmFieldDirty && !passwordsMatch) || !isPasswordLongEnough}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Finalize Profile Registration"}
                    </button>
                </form>
                <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
                    <span>Already have an account? </span>
                    <Link
                        href="/login"
                        className="text-orange-600 hover:underline transition-all cursor-pointer font-bold"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}