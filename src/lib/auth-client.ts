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
    },
});

export const { useSession, signIn, signUp, signOut } = authClient;