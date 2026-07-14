import { createAuthClient } from "better-auth/react";


const apiBase = process.env.NEXT_PUBLIC_API_URL;

const authBaseURL = apiBase
    ? // Expect NEXT_PUBLIC_API_URL to be the backend origin, e.g. https://api.example.com
      `${apiBase.replace(/\/$/, "")}/api/auth`
    : "http://localhost:4000/api/auth";

export const authClient = createAuthClient({
    baseURL: authBaseURL,
    fetchOptions: {
        credentials: "include",
    },
});

export const { useSession, signIn, signUp, signOut } = authClient;