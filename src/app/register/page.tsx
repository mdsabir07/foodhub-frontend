"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, Mail, Lock, User, Store, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useAppRouter } from "@/src/hooks/useAppRouter";

type UserRole = "CUSTOMER" | "PROVIDER";

export default function RegisterPage() {
    const { navigate } = useAppRouter();

    const [role, setRole] = useState<UserRole>("CUSTOMER");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            // 📝 Ready to switch this out for Better Auth's sign-up handler later!
            await new Promise((resolve) => setTimeout(resolve, 1200));

            // Navigate to login on successful creation
            navigate("/login");
        } catch (err) {
            setErrorMessage("Registration failed. Account may already exist.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-slate-950">

            {/* LEFT COLUMN: INTERACTIVE SIGNUP FORM */}
            <div className="flex flex-col justify-center px-6 py-12 lg:col-span-5 lg:px-12 xl:px-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                <div className="mx-auto w-full max-w-sm">

                    <div className="flex items-center gap-2 text-xl font-bold text-orange-600 mb-6">
                        <UtensilsCrossed className="h-6 w-6" />
                        <span>FoodHub</span>
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-orange-600 dark:text-orange-400 hover:underline">
                            Sign In
                        </Link>
                    </p>

                    {errorMessage && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">

                        {/* ROLE SELECTOR CARDS */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                I want to register as a:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("CUSTOMER")}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${role === "CUSTOMER"
                                        ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-medium"
                                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950"
                                        }`}
                                >
                                    <User className="h-5 w-5" />
                                    <span className="text-xs">Customer</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("PROVIDER")}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${role === "PROVIDER"
                                        ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-medium"
                                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950"
                                        }`}
                                >
                                    <Store className="h-5 w-5" />
                                    <span className="text-xs">Food Provider</span>
                                </button>
                            </div>
                        </div>

                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                {role === "PROVIDER" ? "Business Name" : "Full Name"}
                            </label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    {role === "PROVIDER" ? <Store className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                </span>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={role === "PROVIDER" ? "Gourmet Bistro Cafe" : "Alex Johnson"}
                                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Email address
                            </label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <Mail className="h-5 w-5" />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <Lock className="h-5 w-5" />
                                </span>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-medium text-white hover:bg-orange-500 disabled:bg-orange-600/70 shadow-lg shadow-orange-600/10 cursor-pointer transition-all mt-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                </div>
            </div>

            {/* RIGHT COLUMN: BRAND GRAPHIC */}
            <div className="hidden lg:flex lg:col-span-7 bg-radial from-orange-600/10 via-transparent to-transparent items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Join the FoodHub Marketplace
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Whether you are ordering fresh meals or management-hosting a commercial kitchen pipeline, our secure unified runtime makes it fast and frictionless.
                    </p>
                </div>
            </div>

        </div>
    );
}