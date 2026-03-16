const asBoolean = (value: string | undefined): boolean => {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
};

export const isExpandedContentPublic = (): boolean => {
    return asBoolean(process.env.CMS_EXPANDED_CONTENT_PUBLIC || process.env.NEXT_PUBLIC_CMS_EXPANDED_CONTENT_PUBLIC);
};
