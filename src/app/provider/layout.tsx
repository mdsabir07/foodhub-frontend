"use client";

import { ProtectedRoute } from "@/src/components/shared/ProtectedRoute";
import React from "react";

export default function ProviderRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["PROVIDER"]} >
            {children}
        </ProtectedRoute>
    )
}