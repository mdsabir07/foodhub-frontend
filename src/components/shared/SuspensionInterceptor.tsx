"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { toast } from "react-hot-toast";

export function SuspensionInterceptor({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const originalFetch = window.fetch;

        // Monkeypatch the browser fetch call globally
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);

            // Catch 403 Forbidden errors which indicate real-time suspension triggers
            if (response.status === 403) {
                const clone = response.clone();
                try {
                    const data = await clone.json();

                    // Verify if the payload contains account suspension message
                    if (data.message && data.message.toLowerCase().includes("suspended")) {

                        // Clear the active Better-Auth session cookie
                        await authClient.signOut();

                        toast.error("Access Denied: Your account has been suspended by the administrator.", {
                            id: "suspension-global-toast", // Prevents overlapping toast banners
                            duration: 5000,
                        });

                        // Redirect to home/login screen
                        router.push("/");
                    }
                } catch (err) {
                    // Fail silently if response is not JSON or does not contain a message
                }
            }

            return response;
        };

        // Cleanup: Restore default window fetch on unmount
        return () => {
            window.fetch = originalFetch;
        };
    }, [router]);

    return <>{children}</>;
}