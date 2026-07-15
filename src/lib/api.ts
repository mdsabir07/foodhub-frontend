import axios from "axios";

export const api = axios.create({
    // ⚡ FIXED: Forces relative routing in the browser to trigger Next.js proxy rewrites,
    // while keeping the backend absolute URL fallback for SSR/server-side operations.
    baseURL: typeof window !== "undefined"
        ? "/api"
        : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"),
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});