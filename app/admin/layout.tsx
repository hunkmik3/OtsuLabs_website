"use client";

import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        document.body.classList.add("is-admin-route");
        return () => {
            document.body.classList.remove("is-admin-route");
        };
    }, []);

    return <>{children}</>;
}

