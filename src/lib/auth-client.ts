import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/auth`
        : "http://localhost:4000/api/auth",
    fetchOptions: {
        credentials: "include"
    }
});

export const { useSession, signIn, signUp, signOut } = authClient;