"use client";
import type {
    AboutProjectSection,
    AnimationKeySection,
    CreditsSection,
    KeyHighlightPairSection,
    MoreProjectsSection,
    PostExplorationGallerySection,
    PreProductionSection,
    ProductionSection,
    ProjectSection,
    ProjectSectionType,
    HeroSection,
    MediaAsset,
} from "@/lib/cms/types";
import RepeaterField from "@/components/admin/RepeaterField";
import MediaInputField from "@/components/admin/fields/MediaInputField";
import styles from "@/components/admin/admin.module.css";

interface SectionEditorFactoryProps {
    section: ProjectSection;
    onChange: (section: ProjectSection) => void;
}

const createItemId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
const parseCreditNames = (value: string) =>
    value
        .split(/\n|,/g)
        .map((name) => name.trim())
        .filter(Boolean);

const defaultMedia = (): MediaAsset => ({
    src: "",
    alt: "",
    type: "image",
});

const updateSection = <T extends ProjectSection>(section: T, onChange: (section: ProjectSection) => void, next: Partial<T>) => {
    onChange({
        ...section,
        ...next,
    });
};

const updateSectionContent = <T extends ProjectSection>(
    section: T,
    onChange: (section: ProjectSection) => void,
    nextContent: T["content"]
) => {
    updateSection(section, onChange, {
        content: nextContent,
    } as Partial<T>);
};

const CommonSectionFields = ({
    type,
    heading,
    subheading,
    onHeadingChange,
    onSubheadingChange,
}: {
    type: ProjectSectionType;
    heading?: string;
    subheading?: string;
    onHeadingChange: (value: string) => void;
    onSubheadingChange: (value: string) => void;
}) => (
    <div className={styles.row}>
        <div className={styles.field}>
            <label className={styles.label}>{type} heading</label>
            <input className={styles.input} value={heading || ""} onChange={(event) => onHeadingChange(event.target.value)} />
        </div>
        <div className={styles.field}>
            <label className={styles.label}>{type} subheading</label>
            <input className={styles.input} value={subheading || ""} onChange={(event) => onSubheadingChange(event.target.value)} />
        </div>
    </div>
);

const HeroEditor = ({ section, onChange }: { section: HeroSection; onChange: (section: ProjectSection) => void }) => (
    <>
        <CommonSectionFields
            type={section.type}
            heading={section.heading}
            subheading={section.subheading}
            onHeadingChange={(heading) => updateSection(section, onChange, { heading })}
            onSubheadingChange={(subheading) => updateSection(section, onChange, { subheading })}
        />

        <div className={styles.row}>
            <div className={styles.field}>
                <label className={styles.label}>Title text</label>
                <input
                    className={styles.input}
                    value={section.content.titleText}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            titleText: event.target.value,
                        })
                    }
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>View full video label</label>
                <input
                    className={styles.input}
                    value={section.content.viewFullVideoLabel}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            viewFullVideoLabel: event.target.value,
                        })
                    }
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Animation time label</label>
                <input
                    className={styles.input}
                    value={section.content.animationTimeLabel}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            animationTimeLabel: event.target.value,
                        })
                    }
                />
            </div>
        </div>

        <MediaInputField
            label="Hero media"
            value={section.content.media}
            onChange={(media) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    media,
                })
            }
        />

        <RepeaterField
            label="Meta items"
            itemLabel="Meta Item"
            items={section.content.metaItems}
            onChange={(metaItems) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    metaItems,
                })
            }
            createItem={() => ({ label: "", value: "" })}
            renderItem={(item, _, onItemChange) => (
                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>Label</label>
                        <input
                            className={styles.input}
                            value={item.label}
                            onChange={(event) => onItemChange({ ...item, label: event.target.value })}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Value</label>
                        <input
                            className={styles.input}
                            value={item.value}
                            onChange={(event) => onItemChange({ ...item, value: event.target.value })}
                        />
                    </div>
                </div>
            )}
        />
    </>
);

const AboutEditor = ({ section, onChange }: { section: AboutProjectSection; onChange: (section: ProjectSection) => void }) => (
    <>
        <CommonSectionFields
            type={section.type}
            heading={section.heading}
            subheading={section.subheading}
            onHeadingChange={(heading) => updateSection(section, onChange, { heading })}
            onSubheadingChange={(subheading) => updateSection(section, onChange, { subheading })}
        />

        <div className={styles.row}>
            <div className={styles.field}>
                <label className={styles.label}>Badge label</label>
                <input
                    className={styles.input}
                    value={section.content.badgeLabel}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            badgeLabel: event.target.value,
                        })
                    }
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Scope badge label</label>
                <input
                    className={styles.input}
                    value={section.content.scopeBadgeLabel}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            scopeBadgeLabel: event.target.value,
                        })
                    }
                />
            </div>
        </div>

        <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
                className={styles.textarea}
                value={section.content.description}
                onChange={(event) =>
                    updateSectionContent(section, onChange, {
                        ...section.content,
                        description: event.target.value,
                    })
                }
            />
        </div>

        <RepeaterField
            label="Scope items"
            itemLabel="Scope Item"
            items={section.content.scopeItems}
            onChange={(scopeItems) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    scopeItems,
                })
            }
            createItem={() => ""}
            renderItem={(item, _, onItemChange) => (
                <div className={styles.field}>
                    <label className={styles.label}>Scope item</label>
                    <input
                        className={styles.input}
                        value={item}
                        onChange={(event) => onItemChange(event.target.value)}
                    />
                </div>
            )}
        />

        <MediaInputField
            label="Scope top image 1"
            value={section.content.scopeGallery.top[0]}
            onChange={(media) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    scopeGallery: {
                        ...section.content.scopeGallery,
                        top: [media, section.content.scopeGallery.top[1]],
                    },
                })
            }
        />
        <MediaInputField
            label="Scope top image 2"
            value={section.content.scopeGallery.top[1]}
            onChange={(media) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    scopeGallery: {
                        ...section.content.scopeGallery,
                        top: [section.content.scopeGallery.top[0], media],
                    },
                })
            }
        />
        <MediaInputField
            label="Scope bottom image"
            value={section.content.scopeGallery.bottom}
            onChange={(media) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    scopeGallery: {
                        ...section.content.scopeGallery,
                        bottom: media,
                    },
                })
            }
        />
    </>
);

const PreProductionEditor = ({ section, onChange }: { section: PreProductionSection; onChange: (section: ProjectSection) => void }) => (
    <>
        <CommonSectionFields
            type={section.type}
            heading={section.heading}
            subheading={section.subheading}
            onHeadingChange={(heading) => updateSection(section, onChange, { heading })}
            onSubheadingChange={(subheading) => updateSection(section, onChange, { subheading })}
        />

        <div className={styles.row}>
            <div className={styles.field}>
                <label className={styles.label}>Badge label</label>
                <input
                    className={styles.input}
                    value={section.content.badgeLabel}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            badgeLabel: event.target.value,
                        })
                    }
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Auto rotate (ms)</label>
                <input
                    className={styles.input}
                    type="number"
                    value={section.content.autoRotateMs}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            autoRotateMs: Number(event.target.value || 0),
                        })
                    }
                />
            </div>
        </div>

        <div className={styles.field}>
            <label className={styles.label}>Header text</label>
            <textarea
                className={styles.textarea}
                value={section.content.headerText}
                onChange={(event) =>
                    updateSectionContent(section, onChange, {
                        ...section.content,
                        headerText: event.target.value,
                    })
                }
            />
        </div>

        <div className={styles.row}>
            <div className={styles.field}>
                <label className={styles.label}>Character sheet label</label>
                <input
                    className={styles.input}
                    value={section.content.characterSheet.label}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            characterSheet: {
                                ...section.content.characterSheet,
                                label: event.target.value,
                            },
                        })
                    }
                />
            </div>
        </div>

        <div className={styles.field}>
            <label className={styles.label}>Character sheet text</label>
            <textarea
                className={styles.textarea}
                value={section.content.characterSheet.text}
                onChange={(event) =>
                    updateSectionContent(section, onChange, {
                        ...section.content,
                        characterSheet: {
                            ...section.content.characterSheet,
                            text: event.target.value,
                        },
                    })
                }
            />
        </div>

        <RepeaterField
            label="Character items"
            itemLabel="Character"
            items={section.content.characterSheet.items}
            onChange={(items) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    characterSheet: {
                        ...section.content.characterSheet,
                        items,
                    },
                })
            }
            createItem={() => ({
                id: createItemId("character"),
                media: defaultMedia(),
                label: "",
            })}
            renderItem={(item, _, onItemChange) => (
                <>
                    <div className={styles.field}>
                        <label className={styles.label}>Label</label>
                        <input
                            className={styles.input}
                            value={item.label || ""}
                            onChange={(event) => onItemChange({ ...item, label: event.target.value })}
                        />
                    </div>
                    <MediaInputField
                        label="Media"
                        value={item.media}
                        onChange={(media) => onItemChange({ ...item, media })}
                    />
                </>
            )}
        />

        <RepeaterField
            label="Exploration slides"
            itemLabel="Slide"
            items={section.content.explorationSlides}
            onChange={(explorationSlides) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    explorationSlides,
                })
            }
            createItem={() => ({
                id: createItemId("slide"),
                media: defaultMedia(),
                title: "",
                description: "",
            })}
            renderItem={(item, _, onItemChange) => (
                <>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Title</label>
                            <input
                                className={styles.input}
                                value={item.title}
                                onChange={(event) => onItemChange({ ...item, title: event.target.value })}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Description</label>
                            <input
                                className={styles.input}
                                value={item.description}
                                onChange={(event) =>
                                    onItemChange({ ...item, description: event.target.value })
                                }
                            />
                        </div>
                    </div>
                    <MediaInputField
                        label="Slide media"
                        value={item.media}
                        onChange={(media) => onItemChange({ ...item, media })}
                    />
                </>
            )}
        />
    </>
);

const PostExplorationEditor = ({
    section,
    onChange,
}: {
    section: PostExplorationGallerySection;
    onChange: (section: ProjectSection) => void;
}) => (
    <>
        <CommonSectionFields
            type={section.type}
            heading={section.heading}
            subheading={section.subheading}
            onHeadingChange={(heading) => updateSection(section, onChange, { heading })}
            onSubheadingChange={(subheading) => updateSection(section, onChange, { subheading })}
        />

        <div className={styles.field}>
            <label className={styles.label}>Caption</label>
            <textarea
                className={styles.textarea}
                value={section.content.caption}
                onChange={(event) =>
                    updateSectionContent(section, onChange, {
                        ...section.content,
                        caption: event.target.value,
                    })
                }
            />
        </div>

        <MediaInputField
            label="Primary media"
            value={section.content.primary}
            onChange={(primary) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    primary,
                })
            }
        />
        <MediaInputField
            label="Secondary media"
            value={section.content.secondary}
            onChange={(secondary) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    secondary,
                })
            }
        />
    </>
);

const ProductionEditor = ({ section, onChange }: { section: ProductionSection; onChange: (section: ProjectSection) => void }) => (
    <>
        <CommonSectionFields
            type={section.type}
            heading={section.heading}
            subheading={section.subheading}
            onHeadingChange={(heading) => updateSection(section, onChange, { heading })}
            onSubheadingChange={(subheading) => updateSection(section, onChange, { subheading })}
        />

        <div className={styles.row}>
            <div className={styles.field}>
                <label className={styles.label}>Badge label</label>
                <input
                    className={styles.input}
                    value={section.content.badgeLabel}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            badgeLabel: event.target.value,
                        })
                    }
                />
            </div>
        </div>

        <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
                className={styles.textarea}
                value={section.content.description}
                onChange={(event) =>
                    updateSectionContent(section, onChange, {
                        ...section.content,
                        description: event.target.value,
                    })
                }
            />
        </div>

        <MediaInputField
            label="Production media"
            value={section.content.media}
            onChange={(media) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    media,
                })
            }
        />

        <RepeaterField
            label="Overlay items (3)"
            itemLabel="Overlay Text"
            items={section.content.overlayItems}
            onChange={(overlayItems) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    overlayItems: [
                        overlayItems[0] || "",
                        overlayItems[1] || "",
                        overlayItems[2] || "",
                    ],
                })
            }
            createItem={() => ""}
            renderItem={(item, _, onItemChange) => (
                <div className={styles.field}>
                    <label className={styles.label}>Overlay text</label>
                    <input className={styles.input} value={item} onChange={(event) => onItemChange(event.target.value)} />
                </div>
            )}
        />
    </>
);

const AnimationKeyEditor = ({ section, onChange }: { section: AnimationKeySection; onChange: (section: ProjectSection) => void }) => (
    <>
        <CommonSectionFields
            type={section.type}
            heading={section.heading}
            subheading={section.subheading}
            onHeadingChange={(heading) => updateSection(section, onChange, { heading })}
            onSubheadingChange={(subheading) => updateSection(section, onChange, { subheading })}
        />

        <div className={styles.row}>
            <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <input
                    className={styles.input}
                    value={section.content.title}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            title: event.target.value,
                        })
                    }
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Badge label</label>
                <input
                    className={styles.input}
                    value={section.content.badgeLabel}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            badgeLabel: event.target.value,
                        })
                    }
                />
            </div>
        </div>

        <div className={styles.row}>
            <div className={styles.field}>
                <label className={styles.label}>Terms</label>
                <input
                    className={styles.input}
                    value={section.content.terms}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            terms: event.target.value,
                        })
                    }
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Arrow symbol</label>
                <input
                    className={styles.input}
                    value={section.content.arrowSymbol}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            arrowSymbol: event.target.value,
                        })
                    }
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Meta label</label>
                <input
                    className={styles.input}
                    value={section.content.metaLabel}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            metaLabel: event.target.value,
                        })
                    }
                />
            </div>
        </div>

        <RepeaterField
            label="Scenes"
            itemLabel="Scene"
            items={section.content.scenes}
            onChange={(scenes) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    scenes,
                })
            }
            createItem={() => ({
                id: createItemId("scene"),
                label: "",
                media: defaultMedia(),
                duration: "00:00:00",
            })}
            renderItem={(item, _, onItemChange) => (
                <>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Label</label>
                            <input
                                className={styles.input}
                                value={item.label}
                                onChange={(event) => onItemChange({ ...item, label: event.target.value })}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Duration</label>
                            <input
                                className={styles.input}
                                value={item.duration}
                                onChange={(event) => onItemChange({ ...item, duration: event.target.value })}
                            />
                        </div>
                    </div>
                    <MediaInputField
                        label="Scene media"
                        value={item.media}
                        onChange={(media) => onItemChange({ ...item, media })}
                    />
                </>
            )}
        />
    </>
);

const KeyHighlightPairEditor = ({
    section,
    onChange,
}: {
    section: KeyHighlightPairSection;
    onChange: (section: ProjectSection) => void;
}) => (
    <>
        <CommonSectionFields
            type={section.type}
            heading={section.heading}
            subheading={section.subheading}
            onHeadingChange={(heading) => updateSection(section, onChange, { heading })}
            onSubheadingChange={(subheading) => updateSection(section, onChange, { subheading })}
        />

        <div className={styles.field}>
            <label className={styles.label}>Caption</label>
            <input
                className={styles.input}
                value={section.content.caption}
                onChange={(event) =>
                    updateSectionContent(section, onChange, {
                        ...section.content,
                        caption: event.target.value,
                    })
                }
            />
        </div>

        <MediaInputField
            label="Left media"
            value={section.content.leftMedia}
            onChange={(leftMedia) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    leftMedia,
                })
            }
        />
        <MediaInputField
            label="Right media"
            value={section.content.rightMedia}
            onChange={(rightMedia) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    rightMedia,
                })
            }
        />
    </>
);

const CreditsEditor = ({ section, onChange }: { section: CreditsSection; onChange: (section: ProjectSection) => void }) => (
    <>
        <CommonSectionFields
            type={section.type}
            heading={section.heading}
            subheading={section.subheading}
            onHeadingChange={(heading) => updateSection(section, onChange, { heading })}
            onSubheadingChange={(subheading) => updateSection(section, onChange, { subheading })}
        />
        <div className={styles.row}>
            <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <textarea
                    className={styles.textarea}
                    value={section.content.title}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            title: event.target.value,
                        })
                    }
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Badge label</label>
                <input
                    className={styles.input}
                    value={section.content.badgeLabel}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            badgeLabel: event.target.value,
                        })
                    }
                />
            </div>
        </div>

        <RepeaterField
            label="Left column groups"
            itemLabel="Credit Group"
            items={section.content.leftColumn}
            onChange={(leftColumn) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    leftColumn,
                })
            }
            createItem={() => ({ role: "", names: [] })}
            renderItem={(item, _, onItemChange) => (
                <>
                    <div className={styles.field}>
                        <label className={styles.label}>Role</label>
                        <input
                            className={styles.input}
                            value={item.role}
                            onChange={(event) => onItemChange({ ...item, role: event.target.value })}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Names (line or comma)</label>
                        <textarea
                            className={styles.textarea}
                            placeholder={"One name per line\nor comma separated"}
                            value={item.names.join(", ")}
                            onChange={(event) =>
                                onItemChange({
                                    ...item,
                                    names: parseCreditNames(event.target.value),
                                })
                            }
                        />
                    </div>
                </>
            )}
        />

        <RepeaterField
            label="Right column groups"
            itemLabel="Credit Group"
            items={section.content.rightColumn}
            onChange={(rightColumn) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    rightColumn,
                })
            }
            createItem={() => ({ role: "", names: [] })}
            renderItem={(item, _, onItemChange) => (
                <>
                    <div className={styles.field}>
                        <label className={styles.label}>Role</label>
                        <input
                            className={styles.input}
                            value={item.role}
                            onChange={(event) => onItemChange({ ...item, role: event.target.value })}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Names (line or comma)</label>
                        <textarea
                            className={styles.textarea}
                            placeholder={"One name per line\nor comma separated"}
                            value={item.names.join(", ")}
                            onChange={(event) =>
                                onItemChange({
                                    ...item,
                                    names: parseCreditNames(event.target.value),
                                })
                            }
                        />
                    </div>
                </>
            )}
        />
    </>
);

const MoreProjectsEditor = ({
    section,
    onChange,
}: {
    section: MoreProjectsSection;
    onChange: (section: ProjectSection) => void;
}) => (
    <>
        <CommonSectionFields
            type={section.type}
            heading={section.heading}
            subheading={section.subheading}
            onHeadingChange={(heading) => updateSection(section, onChange, { heading })}
            onSubheadingChange={(subheading) => updateSection(section, onChange, { subheading })}
        />

        <div className={styles.row}>
            <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <input
                    className={styles.input}
                    value={section.content.title}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            title: event.target.value,
                        })
                    }
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Back link label</label>
                <input
                    className={styles.input}
                    value={section.content.backLinkLabel}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            backLinkLabel: event.target.value,
                        })
                    }
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Back link href</label>
                <input
                    className={styles.input}
                    value={section.content.backLinkHref}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            backLinkHref: event.target.value,
                        })
                    }
                />
            </div>
        </div>

        <div className={styles.row}>
            <div className={styles.field}>
                <label className={styles.label}>Mode</label>
                <select
                    className={styles.select}
                    value={section.content.mode}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            mode: event.target.value === "manual" ? "manual" : "autoRelated",
                        })
                    }
                >
                    <option value="autoRelated">Auto related</option>
                    <option value="manual">Manual cards</option>
                </select>
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Max items</label>
                <input
                    className={styles.input}
                    type="number"
                    value={section.content.maxItems}
                    onChange={(event) =>
                        updateSectionContent(section, onChange, {
                            ...section.content,
                            maxItems: Number(event.target.value || 0),
                        })
                    }
                />
            </div>
        </div>

        <RepeaterField
            label="Manual cards"
            itemLabel="Card"
            items={section.content.manualItems || []}
            onChange={(manualItems) =>
                updateSectionContent(section, onChange, {
                    ...section.content,
                    manualItems,
                })
            }
            createItem={() => ({
                slug: "",
                title: "",
                subtitle: "",
                year: "YEAR",
                image: defaultMedia(),
            })}
            renderItem={(item, _, onItemChange) => (
                <>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Slug</label>
                            <input
                                className={styles.input}
                                value={item.slug}
                                onChange={(event) => onItemChange({ ...item, slug: event.target.value })}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Title</label>
                            <input
                                className={styles.input}
                                value={item.title}
                                onChange={(event) => onItemChange({ ...item, title: event.target.value })}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Subtitle</label>
                            <input
                                className={styles.input}
                                value={item.subtitle}
                                onChange={(event) => onItemChange({ ...item, subtitle: event.target.value })}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Year</label>
                            <input
                                className={styles.input}
                                value={item.year}
                                onChange={(event) => onItemChange({ ...item, year: event.target.value })}
                            />
                        </div>
                    </div>
                    <MediaInputField
                        label="Card image"
                        value={item.image}
                        onChange={(image) => onItemChange({ ...item, image })}
                    />
                </>
            )}
        />
    </>
);

export default function SectionEditorFactory({ section, onChange }: SectionEditorFactoryProps) {
    switch (section.type) {
        case "hero":
            return <HeroEditor section={section} onChange={onChange} />;
        case "aboutProject":
            return <AboutEditor section={section} onChange={onChange} />;
        case "preProduction":
            return <PreProductionEditor section={section} onChange={onChange} />;
        case "postExplorationGallery":
            return <PostExplorationEditor section={section} onChange={onChange} />;
        case "production":
            return <ProductionEditor section={section} onChange={onChange} />;
        case "animationKey":
            return <AnimationKeyEditor section={section} onChange={onChange} />;
        case "keyHighlightPair":
            return <KeyHighlightPairEditor section={section} onChange={onChange} />;
        case "credits":
            return <CreditsEditor section={section} onChange={onChange} />;
        case "moreProjects":
            return <MoreProjectsEditor section={section} onChange={onChange} />;
        default:
            return (
                <p className={styles.meta}>Section type not supported in structured editor yet.</p>
            );
    }
}
