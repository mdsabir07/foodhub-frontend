"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export function useAppRouter() {
    const router = useRouter();
    const pathName = usePathname();
    const [isPending, startTransition] = useTransition();

    // Safe, non-blocking navigation wrapper
    const navigate = (href: string, options?: { scroll?: boolean }) => {
        startTransition(() => {
            router.replace(href, options);
        });
    };

    // Safe, non-blocking replace wrapper
    const replace = (href: string, options?: { scroll?: boolean }) => {
        startTransition(() => {
            router.replace(href, options)
        });
    };

    // Safe, non-blocking server components cache refresh wrapper
    const refresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    // Safe back button navigation
    const back = () => {
        startTransition(() => {
            router.back();
        });
    };

    return { navigate, replace, refresh, back, pathName, isPending }
}