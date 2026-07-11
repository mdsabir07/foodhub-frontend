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
    private readonly baseUrl = "http://localhost:4000/api/admin";

    // Standard headers for credential/cookie mapping
    private getRequestOptions(method: string, body?: any): RequestInit {
        return {
            method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            ...(body && { body: JSON.stringify(body) }),
        };
    }

    // ==========================================================
    // 1. GET ALL USER ACCOUNTS FROM BACKEND
    // ==========================================================
    async getAllUsers(): Promise<{ success: boolean; data?: AdminUser[]; error?: string }> {
        try {
            const res = await fetch(`${this.baseUrl}/users`, this.getRequestOptions("GET"));
            const json = await res.json();

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
            const json = await res.json();

            if (res.ok && json.success) {
                return { success: true, data: json.data };
            }
            return { success: false, error: json.message || "Failed to update account privileges." };
        } catch (error: unknown) {
            console.error("❌ ADMIN SERVICE TOGGLE STATUS ERROR:", error);
            return { success: false, error: "Network error: Could not write account state change." };
        }
    }
}

export const adminService = new AdminService();