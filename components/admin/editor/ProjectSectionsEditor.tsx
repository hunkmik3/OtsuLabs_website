"use client";

import { useMemo } from "react";
import SectionCard from "@/components/admin/SectionCard";
import SectionEditorFactory from "@/components/admin/sections/SectionEditorFactory";
import styles from "@/components/admin/admin.module.css";
import type { ProjectSection } from "@/lib/cms/types";

interface ProjectSectionsEditorProps {
    sections: ProjectSection[];
    collapsedMap: Record<string, boolean>;
    sectionIssues: Record<string, string[]>;
    advancedMode: boolean;
    sectionsJson: string;
    onToggleAdvancedMode: () => void;
    onSectionsJsonChange: (value: string) => void;
    onApplyAdvancedJson: () => void;
    onToggleCollapsed: (sectionId: string) => void;
    onToggleEnabled: (sectionId: string, enabled: boolean) => void;
    onMoveSection: (sectionId: string, direction: "up" | "down") => void;
    onSectionChange: (sectionId: string, nextSection: ProjectSection) => void;
}

const normalizeSections = (sections: ProjectSection[]) =>
    [...sections]
        .sort((a, b) => a.order - b.order)
        .map((section, index) => ({
            ...section,
            order: index,
        }));

export default function ProjectSectionsEditor({
    sections,
    collapsedMap,
    sectionIssues,
    advancedMode,
    sectionsJson,
    onToggleAdvancedMode,
    onSectionsJsonChange,
    onApplyAdvancedJson,
    onToggleCollapsed,
    onToggleEnabled,
    onMoveSection,
    onSectionChange,
}: ProjectSectionsEditorProps) {
    const sortedSections = useMemo(() => normalizeSections(sections), [sections]);

    return (
        <>
            <div className={styles.row}>
                <h2 className={styles.cardTitle}>Sections</h2>
                <button
                    type="button"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={onToggleAdvancedMode}
                >
                    {advancedMode ? "Structured Mode" : "Advanced JSON Mode"}
                </button>
            </div>

            {advancedMode ? (
                <>
                    <div className={styles.field}>
                        <label className={styles.label}>Sections JSON</label>
                        <textarea
                            className={styles.textarea}
                            value={sectionsJson}
                            onChange={(event) => onSectionsJsonChange(event.target.value)}
                        />
                    </div>
                    <div className={styles.row}>
                        <button
                            type="button"
                            className={`${styles.button} ${styles.buttonSecondary}`}
                            onClick={onApplyAdvancedJson}
                        >
                            Apply JSON
                        </button>
                    </div>
                </>
            ) : (
                <div className={styles.sectionCards}>
                    {sortedSections.map((section, index) => (
                        <SectionCard
                            key={section.id}
                            title={section.type}
                            subtitle={`id: ${section.id}`}
                            enabled={section.enabled}
                            collapsed={!!collapsedMap[section.id]}
                            issues={sectionIssues[section.id] || []}
                            onToggleEnabled={(enabled) => onToggleEnabled(section.id, enabled)}
                            onToggleCollapsed={() => onToggleCollapsed(section.id)}
                            onMoveUp={() => onMoveSection(section.id, "up")}
                            onMoveDown={() => onMoveSection(section.id, "down")}
                            disableMoveUp={index === 0}
                            disableMoveDown={index === sortedSections.length - 1}
                        >
                            <SectionEditorFactory
                                section={section}
                                onChange={(nextSection) => onSectionChange(section.id, nextSection)}
                            />
                        </SectionCard>
                    ))}
                </div>
            )}
        </>
    );
}
