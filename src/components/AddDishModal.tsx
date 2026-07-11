// 📁 app/(dashboard)/provider/dashboard/AddDishModal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Upload, Link2, Bold, Italic, List, ListOrdered } from "lucide-react";

interface Category {
    id: string;
    name: string;
}

interface NewDishState {
    name: string;
    categoryId: string;
    price: string;
    description: string;
    image: string;
}

interface AddDishModalProps {
    isOpen: boolean;
    onClose: () => void;
    dbCategories: Category[];
    setDbCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    onDishAdded: (newDishEntry: any) => void;
}

export default function AddDishModal({
    isOpen,
    onClose,
    dbCategories,
    setDbCategories,
    onDishAdded,
}: AddDishModalProps) {
    const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
    const [newDish, setNewDish] = useState<NewDishState>({
        name: "",
        categoryId: dbCategories[0]?.id || "",
        price: "",
        description: "",
        image: "",
    });

    const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [customCategoryName, setCustomCategoryName] = useState("");
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    React.useEffect(() => {
        if (dbCategories.length > 0 && !newDish.categoryId) {
            setNewDish((prev) => ({ ...prev, categoryId: dbCategories[0].id }));
        }
    }, [dbCategories]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        setErrorFeedback(null);

        const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY";
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData,
            });

            const json = await response.json();

            if (json.success) {
                setNewDish((prev) => ({ ...prev, image: json.data.url }));
            } else {
                setErrorFeedback("Image server rejected the upload. Check your API key");
            }
        } catch (error) {
            console.error("ImgBB Upload Exception: ", error);
            setErrorFeedback("Failed to route image stream to ImgBB hosting.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleAddDish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDish.name || !newDish.price) return;
        setErrorFeedback(null);

        try {
            // 💡 Use a mutable let variable to trace the correct category ID
            let activeCategoryId = newDish.categoryId;

            if (isCreatingCategory) {
                if (!customCategoryName.trim()) {
                    setErrorFeedback("Please enter a valid category name.");
                    return;
                }

                const targetName = customCategoryName.trim();

                // 1️⃣ Step One: Search locally inside our loaded categories array
                const localMatch = dbCategories.find(
                    (c) => c.name.toLowerCase() === targetName.toLowerCase()
                );

                if (localMatch) {
                    activeCategoryId = localMatch.id;
                } else {
                    // 2️⃣ Step Two: Send creation request to backend
                    const catResponse = await fetch("http://localhost:4000/api/categories", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: targetName }),
                    });
                    const catJson = await catResponse.json();

                    if (catJson.success) {
                        setDbCategories((prev) => [...prev, catJson.data]);
                        activeCategoryId = catJson.data.id;
                    } else if (catResponse.status === 400 || !catJson.success) {
                        // 3️⃣ Step Three: Fallback query if backend rejects due to duplicate
                        const refreshResponse = await fetch("http://localhost:4000/api/categories", {
                            credentials: "include",
                        });
                        const refreshJson = await refreshResponse.json();

                        const rawCategories = refreshJson.data || refreshJson.categories || refreshJson;
                        const allCategories = Array.isArray(rawCategories) ? rawCategories : [];

                        const serverMatch = allCategories.find(
                            (c: any) => c.name?.toLowerCase() === targetName.toLowerCase()
                        );

                        if (serverMatch) {
                            activeCategoryId = serverMatch.id || serverMatch._id;
                        } else {
                            setErrorFeedback(`Category Verification Failed: ${catJson.error || "Duplicate mismatch"}`);
                            return;
                        }
                    }
                }
            } else {
                // 💡 Safety check: If they are using the select menu dropdown but it defaulted to blank
                if (!activeCategoryId && dbCategories.length > 0) {
                    activeCategoryId = dbCategories[0].id;
                }
            }

            // Final roadblock validation 
            if (!activeCategoryId) {
                setErrorFeedback("Please select or specify a valid category target.");
                return;
            }

            // 🚀 Create the actual meal using our safely resolved activeCategoryId!
            const response = await fetch("http://localhost:4000/api/meals", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newDish.name,
                    description: newDish.description || "Freshly cooked gourmet dish.",
                    price: parseFloat(newDish.price),
                    categoryId: activeCategoryId, // 👈 100% Guaranteed to be populated now
                    image: newDish.image,
                }),
            });

            const json = await response.json();

            if (json.success) {
                const finalCategoryName =
                    dbCategories.find((c) => c.id === activeCategoryId)?.name ||
                    customCategoryName.trim() ||
                    "General";

                const dishEntry = {
                    id: json.data.id,
                    name: json.data.name,
                    category: finalCategoryName,
                    price: json.data.price,
                    ordersCount: 0,
                    isAvailable: true,
                };

                onDishAdded(dishEntry);

                // Reset modal state safely
                setNewDish({ name: "", categoryId: dbCategories[0]?.id || "", price: "", description: "", image: "" });
                setCustomCategoryName("");
                setIsCreatingCategory(false);
                onClose();
            } else {
                setErrorFeedback(json.error || "Failed to create meal record.");
            }
        } catch (error) {
            console.error("Pipeline write failure:", error);
            setErrorFeedback("Could not complete database execution transaction.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40"
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">List New Food Item</h3>
                                <button
                                    onClick={() => {
                                        onClose();
                                        setErrorFeedback(null);
                                    }}
                                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    <XCircle className="h-5 w-5 text-slate-400" />
                                </button>
                            </div>

                            <AnimatePresence>
                                {errorFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -1 }}
                                        className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2"
                                    >
                                        <XCircle className="h-4 w-4 shrink-0" />
                                        <span>{errorFeedback}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleAddDish} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-1">Dish Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newDish.name}
                                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                                        placeholder="e.g. Crispy Honey Garlic Wings"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-bold text-slate-400 block">Category Group</label>
                                            <button
                                                type="button"
                                                onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                                                className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline"
                                            >
                                                {isCreatingCategory ? "Select Existing" : "+ Create New Inline"}
                                            </button>
                                        </div>

                                        {isCreatingCategory ? (
                                            <input
                                                type="text"
                                                required
                                                value={customCategoryName}
                                                onChange={(e) => setCustomCategoryName(e.target.value)}
                                                placeholder="e.g. Tex-Mex"
                                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium text-slate-800 dark:text-slate-100"
                                            />
                                        ) : (
                                            <select
                                                value={newDish.categoryId}
                                                onChange={(e) => setNewDish({ ...newDish, categoryId: e.target.value })}
                                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium text-slate-800 dark:text-slate-100"
                                            >
                                                {dbCategories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 block mb-1">Base Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={newDish.price}
                                            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                                            placeholder="14.99"
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 text-slate-800 dark:text-slate-100"
                                        />
                                    </div>
                                </div>

                                {/* 📝 RICH TEXT EDITOR DESCRIPTION CONTAINER */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-1">Description</label>
                                    <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden focus-within:border-orange-500">
                                        {/* Rich Text Toolbar Options */}
                                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-1.5">
                                            <button type="button" className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer">
                                                <Bold className="h-3.5 w-3.5" />
                                            </button>
                                            <button type="button" className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer">
                                                <Italic className="h-3.5 w-3.5" />
                                            </button>
                                            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                                            <button type="button" className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer">
                                                <List className="h-3.5 w-3.5" />
                                            </button>
                                            <button type="button" className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer">
                                                <ListOrdered className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        {/* Editable Input Body Area */}
                                        <div
                                            contentEditable
                                            onInput={(e) => setNewDish({ ...newDish, description: e.currentTarget.innerHTML })}
                                            className="min-h-[90px] p-3 text-sm focus:outline-none bg-transparent prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 empty:before:content-[attr(placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
                                            placeholder="Describe the flavors, ingredients, or allergens..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-1.5">Dish Cover Image</label>
                                    <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl mb-3 border border-slate-200 dark:border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => { setImageMode("upload"); setNewDish(p => ({ ...p, image: "" })); }}
                                            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${imageMode === "upload" ? "bg-white dark:bg-slate-900 shadow-xs text-orange-600 dark:text-orange-400" : "text-slate-400"}`}
                                        >
                                            <Upload className="h-3.5 w-3.5" /> File Upload
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setImageMode("url"); setNewDish(p => ({ ...p, image: "" })); }}
                                            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${imageMode === "url" ? "bg-white dark:bg-slate-900 shadow-xs text-orange-600 dark:text-orange-400" : "text-slate-400"}`}
                                        >
                                            <Link2 className="h-3.5 w-3.5" /> Direct Image URL
                                        </button>
                                    </div>

                                    {imageMode === "upload" ? (
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 dark:file:bg-orange-950/30 dark:file:text-orange-400 hover:file:bg-orange-100 cursor-pointer"
                                            />
                                            {isUploadingImage && (
                                                <span className="text-xs font-medium text-orange-500 animate-pulse shrink-0">
                                                    Uploading...
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type="url"
                                            value={newDish.image}
                                            onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                                            placeholder="https://images.unsplash.com/photo-example..."
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                                        />
                                    )}

                                    {newDish.image && (
                                        <p className="text-[11px] text-emerald-500 font-semibold mt-1.5 truncate">
                                            ✓ Image Selected: {newDish.image}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUploadingImage || !newDish.image}
                                    className="w-full py-2.5 bg-orange-600 text-white font-bold rounded-xl text-sm hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm and List Dish
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}