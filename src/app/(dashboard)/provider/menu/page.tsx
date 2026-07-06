"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, RefreshCw } from "lucide-react";

interface MenuItem {
    _id: string;
    name: string;
    price: number;
    category: string;
    status: string;
}

export default function ProviderMenuManagement() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form States for adding an item
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Burgers");

    // Fetch items from the backend API on load
    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/provider/meals");
            if (res.ok) {
                const data = await res.json();
                setMenuItems(data);
            }
        } catch (err) {
            console.error("Error fetching menu items:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle adding a dish to the database
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price) return;

        try {
            const res = await fetch("/api/provider/meals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, price: parseFloat(price), category }),
            });

            if (res.ok) {
                const newItem = await res.json();
                setMenuItems((prev) => [...prev, newItem]);
                setIsModalOpen(false);
                setName("");
                setPrice("");
            }
        } catch (err) {
            console.error("Failed to add meal:", err);
        }
    };

    // Handle deleting a dish from the database
    const handleDeleteItem = async (id: string) => {
        if (!confirm("Are you sure you want to remove this dish from your menu?")) return;

        try {
            const res = await fetch(`/api/provider/meals/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setMenuItems((prev) => prev.filter((item) => item._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete meal:", err);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Kitchen Menu Control</h1>
                    <p className="text-sm text-slate-400">Add, edit, or remove active delicacies on the marketplace.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/10 hover:bg-orange-700 transition-all cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Add New Dish
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-48 text-slate-400 gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" /> Loading active inventory...
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                <th className="p-4">Dish Details</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-800">
                            {menuItems.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400">No dishes found. Click "Add New Dish" to begin seeding.</td>
                                </tr>
                            ) : (
                                menuItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-300">
                                        <td className="p-4 font-bold text-slate-900 dark:text-white">{item.name}</td>
                                        <td className="p-4"><span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs">{item.category}</span></td>
                                        <td className="p-4 font-mono">${item.price.toFixed(2)}</td>
                                        <td className="p-4 text-right space-x-1">
                                            <button onClick={() => handleDeleteItem(item._id)} className="p-1.5 hover:text-red-500 text-slate-400 transition-colors cursor-pointer">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* DYNAMIC MODAL LAYER */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-slate-950 dark:text-white">Add Item to Menu</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Item Title</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl text-sm outline-none" placeholder="e.g. Classic Beef Burger" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Price ($ USD)</label>
                                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl text-sm outline-none" placeholder="12.99" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Food Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl text-sm outline-none">
                                    <option value="Burgers">Burgers</option>
                                    <option value="Sides">Sides</option>
                                    <option value="Desserts">Desserts</option>
                                    <option value="Beverages">Beverages</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-3 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-700 transition-all">
                                Publish to Marketplace Menu
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}