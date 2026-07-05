"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ("CUSTOMER" | "PROVIDER" | "ADMIN")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const { navigate } = useAppRouter();

    useEffect(() => {
        if (!loading) {
            // If no user is logged in, instantly boot them to login
            if (!user) {
                navigate("/login");
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                navigate("/meals");
            }
        }
    }, [user, loading, navigate, allowedRoles]);

    // Show a clean layout spinner while verifying token states
    if (loading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest">
                    Verifying Credentials...
                </p>
            </div>
        );
    }
    return <>{children}</>;
}