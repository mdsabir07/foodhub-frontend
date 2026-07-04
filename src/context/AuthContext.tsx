import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { api } from "../lib/api";

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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [, startTransition] = useTransition();

    // Check if the user has an active backend session cookie on initialization
    const refreshUser = async () => {
        try {
            const response = await api.get("/auth/me");
            startTransition(() => {
                if (response.data?.success) {
                    setUser(response.data.user)
                } else {
                    setUser(null);
                }
            })
        } catch {
            startTransition(() => {
                setUser(null);
            })
        } finally {
            startTransition(() => {
                setLoading(false);
            })
        }
    }

    useEffect(() => {
        refreshUser();
    }, []);

    const login = (userData: User) => setUser(userData);
    const logout = async () => {
        try {
            await api.post("/auth/sign-out");
        } finally {
            setUser(null);
        }
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