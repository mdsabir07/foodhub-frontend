"use client";

import { motion, AnimatePresence } from "framer-motion";

interface OrderSuccessModalProps {
    isOpen: boolean;
    orderId: string;
    onClose: () => void;
}

export function OrderSuccessModal({ isOpen, orderId, onClose }: OrderSuccessModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-950/98 z-50 flex flex-col items-center justify-center p-4 text-center select-none"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="max-w-md w-full space-y-6"
                    >
                        {/* 🎯 Animated Success Checked Ring */}
                        <div className="relative h-24 w-24 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-500/30"
                            >
                                ✓
                            </motion.div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white tracking-tight">Order Received!</h2>
                            <p className="text-sm text-slate-400">
                                Your kitchen master has accepted the ticket and is heating up the grill.
                            </p>
                        </div>

                        {/* 📋 Digital Receipt Card Box */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-3 shadow-inner">
                            <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                                <span className="text-slate-500 font-medium">Receipt Identifier</span>
                                <span className="font-mono font-bold text-orange-400">{orderId}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-medium">Est. Delivery Interval</span>
                                <span className="text-slate-200 font-semibold">15 - 25 Mins Max</span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3.5 bg-white text-slate-950 font-bold rounded-xl text-sm shadow-xl hover:bg-slate-100 transition-all cursor-pointer active:scale-[0.99]"
                        >
                            Return to Food Hub Marketplace
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}