"use client";

import React, { useState, useEffect } from "react";
import { Star, Loader2, MessageSquare, Send } from "lucide-react";
import { reviewService } from "@/src/services/reviewService";
import { BackendReview } from "@/src/types/review";

interface MealReviewsProps {
    mealId: string;
    isLoggedIn?: boolean;
}

export default function MealReviews({ mealId, isLoggedIn = false }: MealReviewsProps) {
    const [reviews, setReviews] = useState<BackendReview[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // 🔄 The Refresh Trigger: Incrementing this automatically runs the safe fetch effect
    const [refreshKey, setRefreshKey] = useState<number>(0);

    // Form States
    const [rating, setRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // 🛡️ Compliant Fetch Effect (Fully self-contained & async-traced by the linter)
    useEffect(() => {
        let isMounted = true;

        const loadReviews = async () => {
            try {
                const res = await reviewService.getMealReviews(mealId);
                if (isMounted && res.success) {
                    setReviews(res.data);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to load reviews";
                console.error(errorMessage);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (mealId) {
            loadReviews();
        }

        return () => {
            isMounted = false;
        };
    }, [mealId, refreshKey]); // Runs initially, and runs again whenever refreshKey changes

    // Handle Form Submission cleanly typed (No 'any')
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setSubmitting(true);

        try {
            const res = await reviewService.addReview(mealId, { rating, comment });
            if (res.success) {
                setSuccessMsg(res.message);
                setComment("");
                setRating(5);

                // Triggers the useEffect to run again safely after the success delay
                setTimeout(() => {
                    setLoading(true); // safe to do in an event handler!
                    setRefreshKey((prev) => prev + 1);
                    setSuccessMsg(null);
                }, 1500);
            }
        } catch (err) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
                setError(
                    axiosError.response?.data?.error ||
                    axiosError.response?.data?.message ||
                    "Failed to submit your review."
                );
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 mt-12 border-t border-slate-100 dark:border-slate-800/80 pt-8">
            <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-orange-500" /> Customer Feedback
                </h2>
                <p className="text-sm text-slate-400 mt-1">Read reviews or leave your own review below</p>
            </div>

            {/* ✍️ WRITE A REVIEW */}
            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-3xl shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-white">Write a Review</h3>

                    {/* Star Input */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm text-slate-500 mr-2">Your Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(null)}
                                className="transition-transform active:scale-90 cursor-pointer"
                            >
                                <Star
                                    className={`h-6 w-6 ${star <= (hoverRating ?? rating)
                                            ? "fill-orange-500 text-orange-500"
                                            : "text-slate-300 dark:text-slate-700"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Comment Textarea */}
                    <div className="space-y-1">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you liked or how we can improve..."
                            className="w-full min-h-[100px] p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
                        />
                    </div>

                    {/* Messages */}
                    {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
                    {successMsg && <p className="text-xs font-semibold text-emerald-500">{successMsg}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-700 disabled:opacity-55 transition-all cursor-pointer"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                            </>
                        ) : (
                            <>
                                Submit Review <Send className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>
            ) : (
                <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Please log in to share your dining experience!
                    </p>
                </div>
            )}

            {/* 🥞 REVIEW FEEDBACK DISPLAY */}
            {loading ? (
                <div className="flex flex-col items-center py-12 gap-2">
                    <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
                    <p className="text-xs text-slate-400">Fetching customer reviews...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800/80 p-8">
                    <p className="text-sm text-slate-400">No reviews yet. Be the first to try this dish and leave feedback!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((rev) => (
                        <div
                            key={rev.id}
                            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl flex gap-4 items-start shadow-xs"
                        >
                            {/* User Avatar */}
                            <img
                                src={rev.customer.image || "/images/default-avatar.png"}
                                alt={rev.customer.name || "Customer"}
                                className="h-10 w-10 rounded-full object-cover bg-slate-200 dark:bg-slate-800 shrink-0"
                            />

                            {/* Review Info */}
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                                        {rev.customer.name || "Verified Customer"}
                                    </h4>
                                    <span className="text-[11px] text-slate-400">
                                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>

                                {/* Rating Stars */}
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-3.5 w-3.5 ${i < rev.rating
                                                    ? "fill-orange-500 text-orange-500"
                                                    : "text-slate-200 dark:text-slate-800"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Optional Comment text */}
                                {rev.comment && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                                        {rev.comment}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}