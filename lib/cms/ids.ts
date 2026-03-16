import { randomUUID } from "node:crypto";

const toSafeIdPart = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const createProjectId = () => `project_${randomUUID()}`;

export const createSectionId = (sectionType: string) => `section_${toSafeIdPart(sectionType) || "block"}_${randomUUID()}`;

export const createItemId = (itemType: string) => `item_${toSafeIdPart(itemType) || "entry"}_${randomUUID()}`;
export const createRedirectId = () => `redirect_${randomUUID()}`;

export const createIsoNow = () => new Date().toISOString();
