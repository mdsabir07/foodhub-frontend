"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the catastrophic root error to your debugging console
        console.error("Catastrophic Root Crash Intercepted:", error);
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 text-center antialiased">
                <div className="max-w-md w-full space-y-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl">

                    {/* Emergency Alert Graphic */}
                    <div className="h-16 w-16 mx-auto bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100">
                        <AlertTriangle className="h-8 w-8 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-slate-950">
                            System Fault Isolated
                        </h2>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                            A critical exception occurred within the core application providers or shell layout. The environment has been frozen for safety.
                        </p>
                    </div>

                    {/* Recovery Interaction Handle */}
                    <button
                        onClick={() => reset()}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md shadow-red-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <RotateCcw className="h-4 w-4" /> Attempt Application Reset
                    </button>

                </div>
            </body>
        </html>
    );
}