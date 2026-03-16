"use client";

import type { ReactNode } from "react";
import styles from "@/components/admin/admin.module.css";

interface RepeaterFieldProps<T> {
    label: string;
    itemLabel?: string;
    items: T[];
    onChange: (nextItems: T[]) => void;
    createItem: () => T;
    renderItem: (item: T, index: number, onItemChange: (nextItem: T) => void) => ReactNode;
}

const moveItem = <T,>(items: T[], index: number, direction: "up" | "down") => {
    const next = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) {
        return next;
    }
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    return next;
};

export default function RepeaterField<T>({
    label,
    itemLabel = "Item",
    items,
    onChange,
    createItem,
    renderItem,
}: RepeaterFieldProps<T>) {
    return (
        <div className={styles.repeaterField}>
            <div className={styles.row}>
                <p className={styles.mediaFieldTitle}>{label}</p>
                <button
                    type="button"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={() => onChange([...items, createItem()])}
                >
                    Add {itemLabel}
                </button>
            </div>

            <div className={styles.repeaterItems}>
                {items.length === 0 ? (
                    <p className={styles.meta}>No {itemLabel.toLowerCase()} yet. Click Add {itemLabel} to start.</p>
                ) : null}
                {items.map((item, index) => (
                    <div key={index} className={styles.repeaterItemCard}>
                        <div className={styles.row}>
                            <p className={styles.meta}>#{index + 1}</p>
                            <button
                                type="button"
                                className={`${styles.button} ${styles.buttonSecondary}`}
                                onClick={() => onChange(moveItem(items, index, "up"))}
                                disabled={index === 0}
                            >
                                Up
                            </button>
                            <button
                                type="button"
                                className={`${styles.button} ${styles.buttonSecondary}`}
                                onClick={() => onChange(moveItem(items, index, "down"))}
                                disabled={index === items.length - 1}
                            >
                                Down
                            </button>
                            <button
                                type="button"
                                className={`${styles.button} ${styles.buttonDanger}`}
                                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                            >
                                Remove
                            </button>
                        </div>
                        {renderItem(item, index, (nextItem) => {
                            const nextItems = [...items];
                            nextItems[index] = nextItem;
                            onChange(nextItems);
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
