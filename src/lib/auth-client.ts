import { createAuthClient } from "better-auth/react";

// ⚡ Because of the next.config.ts rewrite, the backend now "lives" on your frontend's domain.
// In production on Vercel, this automatically targets your live Vercel domain.
// In development, this naturally targets http://localhost:3000.
const authBaseURL = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export const authClient = createAuthClient({
    baseURL: authBaseURL,
    fetchOptions: {
        credentials: "include", // 👈 Vital to let the browser automatically store and pass cookies
    },
});

export const { useSession, signIn, signUp, signOut } = authClient;