"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";

// You can easily swap these out or pass them as props!
const SLIDE_IMAGES = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1920&q=80"
];

interface HeroProps {
    useVideo?: boolean;
    videoUrl?: string;
}

export default function Hero({
    useVideo = true,
    videoUrl = "https://player.vimeo.com/external/435674703.sd.mp4?s=7fdb18fb63945a05b38d3886cd75fa98939c36cf&profile_id=165&oauth2_token_id=57447761"
}: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-scroll through background images if video is disabled
    useEffect(() => {
        if (useVideo) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
        }, 5000); // Transitions background every 5 seconds
        return () => clearInterval(interval);
    }, [useVideo]);

    return (
        <div className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-slate-950">

            {/* 🎬 Option A: Background Video Player */}
            {useVideo ? (
                <div className="absolute inset-0 w-full h-full object-cover">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-40 scale-105"
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                </div>
            ) : (
                /* 🖼️ Option B: Background Image Fading Slider */
                <div className="absolute inset-0 w-full h-full">
                    {SLIDE_IMAGES.map((image, index) => (
                        <div
                            key={image}
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out scale-105 ${index === currentSlide ? "opacity-30" : "opacity-0"
                                }`}
                            style={{ backgroundImage: `url('${image}')` }}
                        />
                    ))}
                </div>
            )}

            {/* Modern Gradient Overlays for perfect readability & contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/70 to-slate-950/90 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none" />

            {/* 🚀 Hero content wrapped securely */}
            <header className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6 z-10">

                {/* Animated Feature Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 font-extrabold text-xs tracking-wide uppercase mx-auto backdrop-blur-xs border border-orange-500/30">
                    <Flame className="h-3.5 w-3.5 animate-pulse" /> Local Kitchens Delivered Fast
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] sm:leading-[1.15]">
                    Savor Premium Dishes Cooked By <span className="text-orange-500 drop-shadow-sm">Neighborhood Experts</span>
                </h1>

                {/* Sub-headline */}
                <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
                    Skip the generic fast food chains. Order authentic, farm-fresh meals crafted with passion by curated culinary artists near you.
                </p>

                {/* CTA Button */}
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