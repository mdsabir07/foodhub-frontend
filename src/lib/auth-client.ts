import { createAuthClient } from "better-auth/react";


// Expect NEXT_PUBLIC_API_URL to be the BACKEND origin.
// If it accidentally includes `/api`, we normalize it to avoid `/api/api/auth`.
const apiBase = process.env.NEXT_PUBLIC_API_URL;

const normalizedApiBase = apiBase
    ? apiBase.replace(/\/$/, "").replace(/\/api\/?$/, "")
    : "http://localhost:4000";

// better-auth expects the baseURL to be the server origin; it internally appends `/api/auth`.
// We intentionally pass ONLY the origin to avoid any chance of double `/api`.
const authBaseURL = normalizedApiBase;

export const authClient = createAuthClient({
    baseURL: authBaseURL,
    fetchOptions: {
        credentials: "include",
        onRequest: ({ options }) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("better-auth.session_token");
                if (token) {
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${token}`,
                    };
                }
            }
        },
        // 💾 Listen for new tokens from the server response and cache them
        onResponse: ({ response }) => {
            // ✅ Safely type-cast the response to include the custom '_data' field to satisfy ESLint
            const responseData = (response as { _data?: Record<string, unknown> })._data;

            if (responseData?.token && typeof window !== "undefined") {
                localStorage.setItem("better-auth.session_token", responseData.token as string);
            }
        }
    },
});

export const { useSession, signIn, signUp, signOut } = authClient;