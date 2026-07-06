"use client";

import React, { createContext, useContext } from "react";
import { authClient } from "../lib/auth-client";

interface User {
    id: string;
    email: string;
    name: string | null;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // 🛡️ Read reactive session state directly from the hook wrapper
    const { data: session, isPending: loading } = authClient.useSession();

    // FIXED: Instead of using useEffect + setState (which caused the render warning),
    // we derive the user data dynamically during execution.
    const user: User | null = session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name || null,
            // FIXED: Accessing custom field via type casting to safely bypass the standard schema check
            role: ((session.user as any).role?.toUpperCase() as "CUSTOMER" | "PROVIDER" | "ADMIN") || "CUSTOMER",
        }
        : null;

    // Legacy method stubs preserved to maintain backward compatibility
    const login = () => { };

    const logout = async () => {
        await authClient.signOut();
    };

    const refreshUser = async () => {
        return;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be contained within an AuthProvider");
    return context;
}