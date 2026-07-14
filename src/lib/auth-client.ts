import { createAuthClient } from "better-auth/react";


const apiBase = process.env.NEXT_PUBLIC_API_URL;

// NEXT_PUBLIC_API_URL must be the BACKEND origin, e.g. https://dishmarket-backend.onrender.com
// (i.e. it must NOT include /api)
const authBaseURL = apiBase
    ? `${apiBase.replace(/\/$/, "")}/api/auth`
    : "http://localhost:4000/api/auth";

export const authClient = createAuthClient({
    baseURL: authBaseURL,
    fetchOptions: {
        credentials: "include",
    },
});

export const { useSession, signIn, signUp, signOut } = authClient;