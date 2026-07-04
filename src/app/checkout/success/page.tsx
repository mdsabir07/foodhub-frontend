"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, ClipboardCheck, Clock } from "lucide-react";

export default function CheckoutSuccessPage() {
    // Mock transaction data matching standard database schemas
    const orderReceipt = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        estimatedDelivery: "25-35 mins",
        totalPaid: "$34.50",
        paymentMethod: "Stripe Gateway (Sandbox)"
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex items-center justify-center p-4 transition-colors duration-200">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6"
            >

                {/* SUCCESS ICON ANIMATION */}
                <div className="flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                        className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-xs"
                    >
                        <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
                    </motion.div>
                </div>

                {/* HEADER */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-black tracking-tight">Order Placed Successfully!</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Your meal ticket has been dispatched straight to the provider's kitchen pipeline.
                    </p>
                </div>

                {/* RECEIPT BREAKDOWN BOX */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 text-left space-y-3 font-medium text-sm">

                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ClipboardCheck className="h-3.5 w-3.5" /> Reference ID
                        </span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {orderReceipt.id}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Estimated Arrival</span>
                        <span className="font-bold flex items-center gap-1 text-orange-600 dark:text-orange-400">
                            <Clock className="h-4 w-4" /> {orderReceipt.estimatedDelivery}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Total Settled</span>
                        <span className="font-bold text-slate-900 dark:text-white">{orderReceipt.totalPaid}</span>
                    </div>

                    <div className="flex justify-between text-xs text-slate-400 pt-1">
                        <span>Gateway Channel</span>
                        <span>{orderReceipt.paymentMethod}</span>
                    </div>

                </div>

                {/* ACTION ROUTER BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                        href="/orders"
                        className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 font-bold text-sm rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center cursor-pointer"
                    >
                        Track Order
                    </Link>
                    <Link
                        href="/meals"
                        className="flex-1 py-3 px-4 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-500 shadow-lg shadow-orange-600/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                        <span>Browse More</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

            </motion.div>

        </div>
    );
}