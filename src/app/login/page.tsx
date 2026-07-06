"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";
import { Mail, Lock, AlertCircle, Loader2, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth(); // Using your pre-existing login state setter

    // Field Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Status Control States
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setPending(true);

        try {
            // 1. Post credentials directly to your backend authentication endpoint
            const res = await api.post("/auth/login", { email, password });

            if (res.data?.success && res.data?.user) {
                const loggedInUser = res.data.user;

                // 2. Hydrate your global AuthContext state so route guards recognize the session
                login(loggedInUser);

                // 3. Evaluate the uppercase role and instantly route to the correct workspace
                const role = loggedInUser.role;
                if (role === "ADMIN") {
                    router.push("/admin");
                } else if (role === "PROVIDER") {
                    router.push("/provider/dashboard");
                } else {
                    router.push("/meals"); // Default customer landing marketplace
                }
            } else {
                setError(res.data?.message || "Invalid email or password combination.");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Connection refused. Ensure your backend server is running.");
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-6 shadow-sm">

                <div>
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Welcome Back</h2>
                    <p className="text-xs text-slate-400 mt-1">Sign in to resume tracking orders and managing menus.</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-600 rounded-xl text-xs font-semibold">
                        <AlertCircle className="h-4 w-4 shrink-0" /> <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* EMAIL INPUT */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={pending}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 font-medium"
                                placeholder="name@domain.com"
                                required
                            />
                        </div>
                    </div>

                    {/* PASSWORD INPUT */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={pending}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer text-white"
                    >
                        {pending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <LogIn className="h-4 w-4" /> Authenticate Session
                            </>
                        )}
                    </button>
                </form>
                <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
                    <span>Don't have an account? </span>
                    <Link
                        href="/register"
                        className="text-orange-600 hover:underline transition-all cursor-pointer font-bold"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}