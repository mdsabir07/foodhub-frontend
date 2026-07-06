"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to your evaluation console matrix
        console.error("Captured Runtime App Crash:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center select-none">
            <div className="max-w-md w-full space-y-6">

                {/* Warning Badge Graphic */}
                <div className="h-24 w-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertTriangle className="h-10 w-10 text-red-500 animate-pulse" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        System Overheat
                    </h2>
                    <p className="text-sm text-slate-400 max-w-xs mx-auto">
                        A background data pipeline stream processing exception occurred. This has been captured for audit logs.
                    </p>
                </div>

                {/* Action Controls */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => reset()}
                        className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-sm shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <RefreshCw className="h-4 w-4" /> Hot Reload Stream
                    </button>

                    <Link
                        href="/"
                        className="flex-1 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold rounded-xl text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Home className="h-4 w-4" /> Storefront Hub
                    </Link>
                </div>

            </div>
        </div>
    );
}