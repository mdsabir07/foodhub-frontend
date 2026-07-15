"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/src/lib/auth-client"; // Adjust based on your Better-Auth client path
import { toast } from "react-hot-toast";
import { Loader2, Mail, Lock, Shield } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all credentials.");
            return;
        }

        setLoading(true);

        try {
            // 🔐 1. Execute Auth Sign-in
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password.");
                setLoading(false);
                return;
            }

            // 🔍 2. Extract Token dynamically from the login data payload
            // Better Auth heavily nested objects can hold token strings or session tokens directly
            const authPayload = data as Record<string, any>;
            const token = authPayload?.token || authPayload?.session?.token;

            if (token) {
                // Force save it instantly so the interceptor can grab it for subsequent calls
                localStorage.setItem("better-auth.session_token", token);
            }

            // ⚡ 3. Force an immediate session verification update now that the token is set
            const sessionCheck = await authClient.getSession();
            console.log("Immediate Post-Login Session Check:", sessionCheck);

            const loggedUser = data?.user as Record<string, unknown>;

            if (loggedUser) {
                const userRole = typeof loggedUser.role === "string" ? loggedUser.role.trim() : "";
                const userName = (loggedUser.name as string) || "User";

                toast.success(`Welcome back, ${userName}!`);

                // 🔄 4. Completely clear Next.js route caches and redirect hard
                setTimeout(() => {
                    let targetPath = "/meals";
                    if (userRole === "ADMIN") targetPath = "/admin";
                    if (userRole === "PROVIDER") targetPath = "/provider/dashboard";

                    // Force the browser to clear layout memory and navigate cleanly
                    window.location.replace(targetPath);
                }, 200);
            } else {
                toast.error("Login succeeded, but no user record was returned.");
            }
        } catch (err: unknown) {
            console.error("❌ CRITICAL LOGIN EXCEPTION:", err);
            toast.error("Something went wrong. Check browser console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-6">

                {/* Header branding */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                        DishMarket<span className="text-orange-600">.</span>
                    </h1>
                    <p className="text-sm text-slate-400 font-medium">
                        Log in to access your culinary dashboard
                    </p>
                </div>

                {/* Main login form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Password</label>
                            <Link href="/forgot-password" className="text-xs font-bold text-orange-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/15 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                {/* Footer redirection helper */}
                <div className="text-center text-xs font-semibold text-slate-400">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-orange-600 hover:underline">
                        Create one now
                    </Link>
                </div>

                {/* Credentials reminder block for testing */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-[11px] text-slate-400 font-medium">
                    <p className="font-extrabold uppercase tracking-wider text-slate-500">Fast-Track Test Credentials</p>
                    <div className="grid grid-cols-1 gap-1.5 font-mono">
                        <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-red-500 shrink-0" />
                            <span>Admin: admin@sabiha.com / AdminPass123!</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}