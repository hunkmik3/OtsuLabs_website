"use client";

import type { ReactNode } from "react";
import styles from "@/components/admin/admin.module.css";

interface SectionCardProps {
    title: string;
    subtitle: string;
    enabled: boolean;
    collapsed: boolean;
    onToggleEnabled: (enabled: boolean) => void;
    onToggleCollapsed: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    disableMoveUp: boolean;
    disableMoveDown: boolean;
    issues?: string[];
    children: ReactNode;
}

export default function SectionCard({
    title,
    subtitle,
    enabled,
    collapsed,
    onToggleEnabled,
    onToggleCollapsed,
    onMoveUp,
    onMoveDown,
    disableMoveUp,
    disableMoveDown,
    issues = [],
    children,
}: SectionCardProps) {
    return (
        <article className={`${styles.sectionCard} ${issues.length ? styles.sectionCardWithError : ""}`}>
            <div className={styles.row}>
                <div>
                    <h3 className={styles.cardTitle}>{title}</h3>
                    <p className={styles.meta}>{subtitle}</p>
                    {issues.length ? (
                        <div className={styles.sectionIssueList}>
                            {issues.map((issue, index) => (
                                <p key={`${issue}-${index}`} className={`${styles.message} ${styles.error}`}>
                                    {issue}
                                </p>
                            ))}
                        </div>
                    ) : null}
                </div>
                <label className={styles.label}>
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(event) => onToggleEnabled(event.target.checked)}
                    />{" "}
                    enabled
                </label>
                <button
                    type="button"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={onMoveUp}
                    disabled={disableMoveUp}
                >
                    Move Up
                </button>
                <button
                    type="button"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={onMoveDown}
                    disabled={disableMoveDown}
                >
                    Move Down
                </button>
                <button
                    type="button"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={onToggleCollapsed}
                >
                    {collapsed ? "Expand" : "Collapse"}
                </button>
            </div>
            {!collapsed ? <div className={styles.sectionCardBody}>{children}</div> : null}
        </article>
    );
}
