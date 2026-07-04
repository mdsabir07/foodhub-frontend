"use client";

import { motion } from "framer-motion";
import { ArrowRight, FastForward, ShieldCheck, Star, Utensils } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">

      {/* 1. HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-32">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          >
            Delicious Meals, Delivered <span className="text-orange-600 dark:text-orange-500">Straight To Your Door</span>
          </motion.h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Browse menus from top-rated local providers, customize your order, and enjoy fresh food prepared exactly the way you like it.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/meals" className="group flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-500 shadow-lg shadow-orange-600/20 transition-all">
              Explore Menus <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURES GRID */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6">
              <div className="rounded-full bg-orange-100 dark:bg-orange-950/50 p-4 text-orange-600 dark:text-orange-400">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Curated Kitchens</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Only vetted, premium local food providers make it onto our marketplace.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="rounded-full bg-orange-100 dark:bg-orange-950/50 p-4 text-orange-600 dark:text-orange-400">
                <FastForward className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Lightning Delivery</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Real-time status tracking keeps you updated from prep to your porch.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="rounded-full bg-orange-100 dark:bg-orange-950/50 p-4 text-orange-600 dark:text-orange-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Secure Checkout</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Encrypted payments and simple order histories make buying effortless.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}