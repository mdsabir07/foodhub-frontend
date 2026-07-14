"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { authClient } from "@/src/lib/auth-client";
import { Loader2, ShieldAlert, LogOut, Lock } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ("CUSTOMER" | "PROVIDER" | "ADMIN")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const { navigate } = useAppRouter();

    // Safely cast user to check the newly created dynamic database attributes
    const extendedUser = user as any;
    const isSuspended = extendedUser?.isSuspended === true;

    useEffect(() => {
        if (!loading) {
            // Avoid redirecting too aggressively on the first session read.
            // On some live deployments the first session fetch can briefly return null.
            // If session becomes available moments later, we prevent a "login loop".
            if (!user) {
                // Use latest closure-stable refs could be better, but keep it simple:
                // capture current loading->null moment and redirect after a grace period.
                const t = setTimeout(() => {
                    navigate("/login");
                }, 300);
                return () => clearTimeout(t);
            }

            // Role Mismatch Redirect (only if they aren't suspended)
            if (user && !isSuspended && allowedRoles && !allowedRoles.includes(user.role)) {
                navigate("/meals");
            }
        }
    }, [user, loading, navigate, allowedRoles, isSuspended]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verifying security clearances...</p>
            </div>
        );
    }

    // 4. Return null if no user context exists to avoid content flash during redirects
    if (!user) {
        return null;
    }

    if (isSuspended) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 text-center space-y-6">
                    <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                        <Lock className="h-8 w-8 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Account Suspended</h2>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Your account has been temporarily or permanently suspended by system administrators due to a policy violation.
                        </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Security Note</span>
                        <p className="text-[11px] text-slate-500 mt-1">
                            If you believe this action was made in error, please contact the customer support team at <span className="font-bold text-orange-600">support@sabiha.com</span>.
                        </p>
                    </div>

                    <button
                        onClick={async () => {
                            // Terminate session token and wipe active client-side credentials
                            await authClient.signOut();
                            window.location.href = "/";
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold text-sm rounded-xl cursor-pointer transition-all shadow-md"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Return to Marketplace</span>
                    </button>
                </div>
            </div>
        );
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 text-center space-y-4">
                    <div className="mx-auto h-12 w-12 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">Access Forbidden</h2>
                        <p className="text-xs text-slate-400">
                            Your account classification does not have permission to access this administrative control space.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/meals")}
                        className="px-5 py-2.5 bg-orange-600 text-white font-semibold text-xs rounded-xl hover:bg-orange-500 cursor-pointer shadow-lg shadow-orange-600/10 transition-all mt-2"
                    >
                        Back to Menu Catalog
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}