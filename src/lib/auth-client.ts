import { createAuthClient } from "better-auth/react";

const apiBase = process.env.NEXT_PUBLIC_API_URL;

const normalizedApiBase = apiBase
    ? apiBase.replace(/\/$/, "").replace(/\/api\/?$/, "")
    : "http://localhost:4000";

export const authClient = createAuthClient({
    baseURL: normalizedApiBase,
    fetchOptions: {
        credentials: "include",
        onRequest: (context: Record<string, any>) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("better-auth.session_token");
                if (token && context.options) {
                    context.options.headers = {
                        ...context.options.headers,
                        // Forward as a token header for the backend bearer plugin
                        Authorization: `Bearer ${token}`,
                    };
                }
            }
        },
        onResponse: ({ response }) => {
            if (typeof window !== "undefined") {
                const responseData = (response as { _data?: Record<string, any> })._data;

                // Extract token string explicitly sent back by the bearer plugin
                const token = responseData?.token || responseData?.session?.token;

                if (token) {
                    localStorage.setItem("better-auth.session_token", token);
                }
            }
        }
    }
});

export const { useSession, signIn, signUp, signOut } = authClient;