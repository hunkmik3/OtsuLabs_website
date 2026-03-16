"use client";

import { useEffect } from "react";

export const useUnsavedChanges = (isDirty: boolean) => {
    useEffect(() => {
        if (!isDirty) return;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };

        const handleDocumentClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;

            const link = target.closest("a");
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
            if (link.getAttribute("target") === "_blank") return;
            if (href.startsWith(window.location.pathname)) return;

            const allowLeave = window.confirm("You have unsaved changes. Leave this page?");
            if (!allowLeave) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("click", handleDocumentClick, true);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("click", handleDocumentClick, true);
        };
    }, [isDirty]);
};
