"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";

interface Category {
    id: string;
    name: string;
}

interface EditDishModalProps {
    isOpen: boolean;
    onClose: () => void;
    dish: {
        id: string;
        name: string;
        category: string;
        categoryId?: string;
        price: number;
        description?: string;
        image?: string;
    };
    dbCategories: Category[];
    setDbCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    onDishUpdated: (dish: any) => void;
}

export default function EditDishModal({
    isOpen,
    onClose,
    dish,
    dbCategories,
    setDbCategories,
    onDishUpdated,
}: EditDishModalProps) {
    const [editDish, setEditDish] = useState({
        name: "",
        price: "",
        categoryId: "",
        description: "",
        image: "",
    });

    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [customCategoryName, setCustomCategoryName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

    // Hydrate the form states whenever a new dish is passed into the modal parameters
    useEffect(() => {
        if (dish) {
            setEditDish({
                name: dish.name,
                price: dish.price.toString(),
                categoryId: dish.categoryId || "",
                description: dish.description || "",
                image: dish.image || "",
            });
            setErrorFeedback(null);
            setIsCreatingCategory(false);
            setCustomCategoryName("");
        }
    }, [dish, isOpen]);

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editDish.name || !editDish.price) {
            setErrorFeedback("Name and Price fields are strictly required.");
            return;
        }

        setIsSaving(true);
        setErrorFeedback(null);

        try {
            let activeCategoryId = editDish.categoryId;

            // Handle inline Category creation if toggled active
            if (isCreatingCategory) {
                if (!customCategoryName.trim()) {
                    setErrorFeedback("Please enter a valid category name.");
                    setIsSaving(false);
                    return;
                }

                const targetName = customCategoryName.trim();

                // Check local array first to prevent redundant database entries
                const localMatch = dbCategories.find(
                    (c) => c.name.toLowerCase() === targetName.toLowerCase()
                );

                if (localMatch) {
                    activeCategoryId = localMatch.id;
                } else {
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
                    } else {
                        // Fallback refresh search query if duplicates exist
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
                            setErrorFeedback(`Category registration rejected: ${catJson.error}`);
                            setIsSaving(false);
                            return;
                        }
                    }
                }
            }

            // Ensure we have a valid target category fallback mapping
            if (!activeCategoryId && dbCategories.length > 0) {
                activeCategoryId = dbCategories[0].id;
            }

            // Execute the Database Update Transaction
            const response = await fetch(`http://localhost:4000/api/meals/${dish.id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editDish.name,
                    description: editDish.description || "Freshly cooked gourmet dish.",
                    price: parseFloat(editDish.price),
                    categoryId: activeCategoryId,
                    image: editDish.image,
                }),
            });

            const json = await response.json();

            if (json.success) {
                const finalCategoryName =
                    dbCategories.find((c) => c.id === activeCategoryId)?.name ||
                    customCategoryName.trim() ||
                    "General";

                // Map database entries to match client table structures perfectly
                const updatedDishPayload = {
                    id: dish.id,
                    name: json.data.name,
                    category: finalCategoryName,
                    categoryId: activeCategoryId,
                    price: json.data.price,
                    description: json.data.description,
                    image: json.data.image,
                };

                onDishUpdated(updatedDishPayload);
                onClose();
            } else {
                setErrorFeedback(json.error || "Failed to update dynamic database record.");
            }
        } catch (error) {
            console.error("❌ PIPELINE WRITE FAILURE:", error);
            setErrorFeedback("Could not complete transactional edit write.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-200">

                {/* Header line bar */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">Modify Dish Parameters</h3>
                        <p className="text-xs text-slate-400">Edit price points, categories, and cover photography assets.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Main scrollable layout interface form */}
                <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {errorFeedback && (
                        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-100 dark:border-rose-950/45 bg-rose-50/50 dark:bg-rose-950/20 text-xs font-bold text-rose-600 dark:text-rose-400">
                            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                            <span>{errorFeedback}</span>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Dish Name</label>
                        <input
                            type="text"
                            value={editDish.name}
                            onChange={(e) => setEditDish(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-orange-500 transition-colors"
                            placeholder="Gourmet Pasta Bowl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Retail Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editDish.price}
                                onChange={(e) => setEditDish(prev => ({ ...prev, price: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-orange-500 transition-colors"
                                placeholder="18.50"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Category Mapping</label>
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                                    className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                                >
                                    {isCreatingCategory ? "Select Existing" : "Add Custom"}
                                </button>
                            </div>

                            {isCreatingCategory ? (
                                <input
                                    type="text"
                                    value={customCategoryName}
                                    onChange={(e) => setCustomCategoryName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-orange-500 transition-colors"
                                    placeholder="E.g., Desserts"
                                />
                            ) : (
                                <select
                                    value={editDish.categoryId}
                                    onChange={(e) => setEditDish(prev => ({ ...prev, categoryId: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-orange-500 transition-colors cursor-pointer"
                                >
                                    {dbCategories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Image Asset URL (ImgBB / Pexels)</label>
                        <input
                            type="text"
                            value={editDish.image}
                            onChange={(e) => setEditDish(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-orange-500 transition-colors"
                            placeholder="https://images.pexels.com/..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Nutritional Description</label>
                        <textarea
                            value={editDish.description}
                            onChange={(e) => setEditDish(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-orange-500 transition-colors resize-none"
                            placeholder="Prepared with handpicked fresh herbs, low-sodium bases, and high protein sources."
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-500 cursor-pointer shadow-lg shadow-orange-600/10 transition-all disabled:opacity-50"
                            disabled={isSaving}
                        >
                            <Save className="h-4.5 w-4.5" />
                            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}