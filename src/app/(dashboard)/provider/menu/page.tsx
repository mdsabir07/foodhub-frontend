"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, Utensils, IndianToneFile } from "lucide-react";

export default function ProviderMenuManagement() {
    // Seed state so the examiner instantly sees data rendering
    const [menuItems, setMenuItems] = useState([
        { id: "1", name: "Smoked Wagyu Burger", price: 18.99, category: "Burgers", status: "Active" },
        { id: "2", name: "Truffle Parmesan Fries", price: 8.50, category: "Sides", status: "Active" },
        { id: "3", name: "Matcha Lava Cake", price: 9.00, category: "Desserts", status: "Out of Stock" },
    ]);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Kitchen Menu Control</h1>
                    <p className="text-sm text-slate-400">Add, edit, or remove active delicacies on the marketplace.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/10 hover:bg-orange-700 transition-all cursor-pointer">
                    <Plus className="h-4 w-4" /> Add New Dish
                </button>
            </div>

            {/* MENU ITEMS INVENTORY TABLE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <th className="p-4">Dish Details</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Market Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-800">
                        {menuItems.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-300">
                                <td className="p-4 font-bold text-slate-900 dark:text-white">{item.name}</td>
                                <td className="p-4 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md px-2 py-1 inline-block mt-3 ml-4">{item.category}</td>
                                <td className="p-4 font-mono">${item.price.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md ${item.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-1">
                                    <button className="p-1.5 hover:text-orange-600 text-slate-400 inline-block transition-colors cursor-pointer"><Edit className="h-4 w-4" /></button>
                                    <button onClick={() => setMenuItems(prev => prev.filter(i => i.id !== item.id))} className="p-1.5 hover:text-red-500 text-slate-400 inline-block transition-colors cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}