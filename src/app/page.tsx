"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, Utensils, Award, Heart, ChevronRight, Star, ShoppingBag } from "lucide-react";
import { mealService, BackendMeal } from "@/src/services/mealService";
import MealCard, { MealItem } from "@/src/components/MealCard";
import { useCart } from "@/src/hooks/useCart";
import { CartDrawer } from "@/src/components/CartDrawer";
import { OrderSuccessModal } from "@/src/components/OrderSuccessModal";

export default function HomePage() {
  // 🛒 Hook up cart engine core
  const { cart, addToCart, removeFromCart, clearItemRow } = useCart();

  // 🏪 Component States
  const [featuredMeals, setFeaturedMeals] = useState<MealItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🎉 Order confirmation lifecycle states
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState("");

  // ⚡ Sourcing top-tier "Featured" dishes directly from backend track
  useEffect(() => {
    const fetchFeaturedDishes = async () => {
      try {
        setLoading(true);
        const responseData = await mealService.getAllMeals("All", "");

        let rawMealsArray: BackendMeal[] = [];
        if (Array.isArray(responseData)) {
          rawMealsArray = responseData;
        } else if (responseData && typeof responseData === "object") {
          const wrapper = responseData as Record<string, unknown>;
          const potentialArray = wrapper.meals || wrapper.data || Object.values(wrapper).find(Array.isArray);
          if (Array.isArray(potentialArray)) rawMealsArray = potentialArray as BackendMeal[];
        }

        const normalizedData = rawMealsArray.map((item: BackendMeal): MealItem => {
          let providerName = "Gourmet Bistro";
          if (item.kitchen && typeof item.kitchen === "object") {
            const kitchenObj = item.kitchen as Record<string, unknown>;
            if (typeof kitchenObj.name === "string") providerName = kitchenObj.name;
          } else if (item.provider && typeof item.provider === "object") {
            const providerObj = item.provider as Record<string, unknown>;
            if (typeof providerObj.name === "string") providerName = providerObj.name;
          }

          return {
            id: item.id || item._id || Math.random().toString(),
            name: item.title || item.name || "Premium Dish",
            provider: providerName,
            price: Number(item.price) || 0,
            rating: item.rating || 4.8,
            time: item.time || "20-30 min",
            category: typeof item.category === "string" ? item.category : ((item.category as Record<string, unknown>)?.name as string | undefined) || "General",
            image: typeof item.image === "string" && item.image.trim() !== "" ? item.image : "🍳"
          };
        });

        const spotlightItems = normalizedData
          .filter(meal => meal.rating >= 4.7)
          .slice(0, 3);

        setFeaturedMeals(spotlightItems);
      } catch (error) {
        console.error("Failed loading homepage collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDishes();
  }, []);

  // Sleek click tracker to append items and slide drawer into view
  const handleAddToCart = (meal: MealItem) => {
    addToCart(meal);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative flex flex-col">

      {/* MAIN CONTENT SPACE */}
      <div className="flex-grow">
        {/* 🚀 MEANINGFUL SECTION 1: HERO SPOTLIGHT */}
        <header className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold text-xs tracking-wide uppercase mx-auto">
            <Flame className="h-3.5 w-3.5 animate-pulse" /> Local Kitchens Delivered Fast
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight sm:leading-none">
            Savor Premium Dishes Cooked By <span className="text-orange-600">Neighborhood Experts</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Skip the generic fast food chains. Order authentic, farm-fresh meals crafted with passion by curated culinary artists near you.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/meals"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all cursor-pointer group"
            >
              Explore Live Menu <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </header>

        {/* TRUST BADGES & VALUE PROPOSITION */}
        <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-900 py-10 mb-16 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-1 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <Award className="h-7 w-7 text-orange-600 mb-1.5" />
              <h4 className="font-bold text-base text-slate-950 dark:text-white">Curated Top Chefs</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[220px]">Vetted safety standards and premium taste profiles</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <ShoppingBag className="h-7 w-7 text-orange-600 mb-1.5" />
              <h4 className="font-bold text-base text-slate-950 dark:text-white">Zero Minimum Order</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[220px]">Order a small side or a massive party feast</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <Utensils className="h-7 w-7 text-orange-600 mb-1.5" />
              <h4 className="font-bold text-base text-slate-950 dark:text-white">Farm to Counter</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[220px]">100% locally sourced, often organic ingredients</p>
            </div>
          </div>
        </section>

        {/* DAILY SPOTLIGHT GRID */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex justify-between items-end mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Today's Highly Rated Specials
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">
                Trending crowd-pleasers with flawless reviews from your community.
              </p>
            </div>

            <Link
              href="/meals"
              className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              See All Menu Items <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((placeholderId) => (
                <div key={placeholderId} className="h-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featuredMeals.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-900 p-6 max-w-sm mx-auto">
              <Utensils className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-medium">Fresh menu drops arriving shortly!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMeals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onAddToCart={handleAddToCart} // 🔥 Triggers local function to slide open drawer
                />
              ))}
            </div>
          )}
        </main>

        {/* KITCHEN STORY SPOTLIGHT */}
        <section className="bg-slate-100 dark:bg-slate-900/40 py-16 mb-16 border-y border-slate-200 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Note: I'm using an external portrait image here to simulate the 'Chef'. */}
            <div className="relative aspect-video sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1581382575275-97901c2635b7?q=80&w=600&auto=format&fit=crop"
                alt="Chef Alex Rivera preparing local seafood"
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <h5 className="font-bold text-sm text-slate-950 dark:text-white">Alex Rivera</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">Head Chef @ Seafood Market Dock, 1.2 miles away</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-orange-600 font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />4.9 Stars <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs">
                <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> Community Spotlight Kitchen
              </div>
              <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">Authentic Recipes, Craftsmanship, <span className="text-orange-600">Zero Shortcuts</span></h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">Alex uses 20-year-old family recipes, slow-cooking daily to ensure perfection. He believes good food is a right, not a luxury. By ordering through FoodHub, you support culinary masters who prioritize quality over quick profits.</p>
              <Link href="/meals" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-xs hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
                Try Alex's Seafood Paella <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearItemRow={clearItemRow}
        onCheckoutSuccess={(id) => {
          setCurrentOrderId(id);
          setShowSuccess(true);
        }}
      />

      <OrderSuccessModal
        isOpen={showSuccess}
        orderId={currentOrderId}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}