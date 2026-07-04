import React, { createContext, useContext, useEffect, useState, useTransition } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
    const [, startTransition] = useTransition();

    useEffect(() => {
        // Fetch saved preference if available, else default to system
        const savedTheme = localStorage.getItem("foodhub-theme") as Theme || "system";
        startTransition(() => {
            setTheme(savedTheme);
        })
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const updateTheme = () => {
            let activeTheme: "light" | "dark" = "light";

            if (theme === "system") {
                activeTheme = mediaQuery.matches ? "dark" : "light";
            } else {
                activeTheme = theme;
            }

            startTransition(() => {
                setResolvedTheme(activeTheme);
                if (activeTheme === "dark") {
                    root.classList.add("dark");
                } else {
                    root.classList.remove("dark");
                }
            });
        };

        updateTheme();

        if (theme === "system") {
            mediaQuery.addEventListener("change", updateTheme);
            return () => mediaQuery.removeEventListener("change", updateTheme);
        }
    }, [theme]);

    const handleThemeChange = (newTheme: Theme) => {
        startTransition(() => {
            setTheme(newTheme);
        });
        localStorage.setItem("foodhub-theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: handleThemeChange }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be contained within a ThemeProvider");
    return context;
}