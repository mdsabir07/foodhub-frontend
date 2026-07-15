export interface AdminUser {
    id: string;
    name: string | null;
    email: string;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
    isSuspended: boolean;
    createdAt: string;
    emailVerified: boolean;
}

class AdminService {
    // ⚡ FIXED: Safely cleans up trailing slashes AND accidental duplicate /api paths from environment strings
    // ⚡ FIXED: Forces relative routing in the browser to trigger Next.js proxy rewrites
    private readonly baseUrl = (() => {
        // If we are running client-side (in the browser), use a relative path.
        // This forces the request through the Next.js rewrite so cookies are sent securely.
        if (typeof window !== "undefined") {
            return "/api/admin";
        }

        // Fallback for server-side operations (like Metadata generation or SSR) and Local Development
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        const cleanBase = apiUrl.replace(/\/$/, "").replace(/\/api\/?$/, "");
        return `${cleanBase}/api/admin`;
    })();

    // ✅ FIXED: Using explicit conditional assignment instead of object spreading to resolve ts(2698)
    private getRequestOptions(method: string, body?: unknown): RequestInit {
        const options: RequestInit = {
            method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (body !== undefined && body !== null) {
            options.body = JSON.stringify(body);
        }

        return options;
    }

    // ==========================================================
    // 1. GET ALL USER ACCOUNTS FROM BACKEND
    // ==========================================================
    async getAllUsers(): Promise<{ success: boolean; data?: AdminUser[]; error?: string }> {
        try {
            const res = await fetch(`${this.baseUrl}/users`, this.getRequestOptions("GET"));

            // Check if the server returned HTML error templates instead of valid JSON data string formats
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned non-JSON payload message response context.");
            }

            const json = await res.json() as { success: boolean; data?: AdminUser[]; error?: string };

            if (res.ok && json.success) return { success: true, data: json.data };
            return { success: false, error: json.error || "Failed to retrieve user directory." };
        } catch (error: unknown) {
            console.error("❌ ADMIN SERVICE GET USERS ERROR:", error);
            return { success: false, error: "Network error: Could not load users list." };
        }
    }

    // ==========================================================
    // 2. TOGGLE USER SUSPENSION STATE (Suspend / Reactivate)
    // ==========================================================
    async toggleUserSuspension(
        id: string,
        isSuspended: boolean
    ): Promise<{ success: boolean; data?: AdminUser; error?: string }> {
        try {
            const res = await fetch(
                `${this.baseUrl}/users/${id}`,
                this.getRequestOptions("PATCH", { isSuspended })
            );

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned non-JSON payload message response context.");
            }

            const json = await res.json() as { success: boolean; data?: AdminUser; message?: string; error?: string };

            if (res.ok && json.success) {
                return { success: true, data: json.data };
            }
            return { success: false, error: json.message || json.error || "Failed to update account privileges." };
        } catch (error: unknown) {
            console.error("❌ ADMIN SERVICE TOGGLE STATUS ERROR:", error);
            return { success: false, error: "Network error: Could not write account state change." };
        }
    }
}

export const adminService = new AdminService();