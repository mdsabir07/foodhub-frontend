"use client";

import Link from "next/link";
import { UtensilsCrossed, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center select-none">
            <div className="max-w-md w-full space-y-6">

                {/* Animated Error Graphic */}
                <div className="relative h-24 w-24 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                    <UtensilsCrossed className="h-10 w-10 text-orange-600 animate-bounce" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                        404
                    </span>
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Recipe Missing!
                    </h2>
                    <p className="text-sm text-slate-400 max-w-xs mx-auto">
                        The page or dynamic menu track you are trying to access has been removed or cooked out of existence.
                    </p>
                </div>

                {/* Action Controls */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="flex-1 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-800 rounded-xl text-sm shadow-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" /> Go Back
                    </button>

                    <Link
                        href="/"
                        className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-600/10 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Home className="h-4 w-4" /> Return Home
                    </Link>
                </div>

            </div>
        </div>
    );
}