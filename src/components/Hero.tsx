"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";

const SLIDE_IMAGES = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1920&q=80"
];

interface HeroProps {
    useVideo?: boolean;
}

export default function Hero({ useVideo = true }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (useVideo) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [useVideo]);

    return (
        // 🎨 Unified Dark Canvas Background: Keeps elements legible in all app display modes
        <div className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0a1120]">

            {/* ✅ FIXED: Swapped out broken '&&' layout logic with clean ternary '?' condition */}
            {useVideo ? (
                /* 🎬 Video Layer */
                <div className="absolute inset-0 w-full h-full object-cover">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover opacity-25 scale-105"
                    >
                        <source
                            src="https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-41614-large.mp4"
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                </div>
            ) : (
                /* 🖼️ Image Slider Layer */
                <div className="absolute inset-0 w-full h-full">
                    {SLIDE_IMAGES.map((image, index) => (
                        <div
                            key={image}
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out scale-105 ${index === currentSlide ? "opacity-20" : "opacity-0"
                                }`}
                            style={{ backgroundImage: `url('${image}')` }}
                        />
                    ))}
                </div>
            )}

            {/* Overlays: Fades smoothly to transparent at the footer line */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#0a1120]/75 to-[#0a1120]/95 pointer-events-none" />

            {/* 🚀 Content Workspace */}
            <header className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6 z-10">

                {/* Badge Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 font-extrabold text-xs tracking-wide uppercase mx-auto backdrop-blur-xs border border-orange-500/20">
                    <Flame className="h-3.5 w-3.5 animate-pulse" /> Local Kitchens Delivered Fast
                </div>

                {/* Headline text */}
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
                    Savor Premium Dishes Cooked By <span className="text-orange-500 drop-shadow-xs">Neighborhood Experts</span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                    Skip the generic fast food chains. Order authentic, farm-fresh meals crafted with passion by curated culinary artists near you.
                </p>

                {/* Action Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/meals"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-600/30 hover:bg-orange-700 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
                    >
                        Explore Live Menu
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </header>
        </div>
    );
}