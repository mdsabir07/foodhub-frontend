import { createAuthClient } from "better-auth/react";

const apiBase = process.env.NEXT_PUBLIC_API_URL;

const normalizedApiBase = apiBase
    ? apiBase.replace(/\/$/, "").replace(/\/api\/?$/, "")
    : "http://localhost:4000";

const authBaseURL = normalizedApiBase;

export const authClient = createAuthClient({
    baseURL: authBaseURL,
    fetchOptions: {
        credentials: "include",
        // 🔐 Injected via a safe dynamic context object to satisfy the Next.js production compiler
        onRequest: (context: Record<string, any>) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("better-auth.session_token");
                if (token && context.options) {
                    context.options.headers = {
                        ...context.options.headers,
                        Authorization: `Bearer ${token}`,
                    };
                }
            }
        },
        // 💾 Listen for new tokens from the server response and cache them
        onResponse: ({ response }) => {
            const responseData = (response as { _data?: Record<string, unknown> })._data;
            if (responseData?.token && typeof window !== "undefined") {
                localStorage.setItem("better-auth.session_token", responseData.token as string);
            }
        }
    }
});

export const { useSession, signIn, signUp, signOut } = authClient;