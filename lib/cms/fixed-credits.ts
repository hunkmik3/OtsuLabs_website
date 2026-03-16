import type { CreditGroup } from "@/lib/cms/types";

export const FIXED_CREDITS_TITLE = "Meet\nOtsu's Team";

const FIXED_CREDITS_LEFT_COLUMN_SOURCE: CreditGroup[] = [
    { role: "Producer", names: ["Khoa Trinh"] },
    { role: "Director", names: ["Duc Nguyen"] },
    { role: "Animation Director", names: ["Huu Tu"] },
    { role: "Art Director", names: ["Long An"] },
    { role: "Storyboard", names: ["Ngoc Huynh"] },
    { role: "Head Manager", names: ["Raymond Trinh"] },
    { role: "Production Assistant", names: ["Trung Nguyen", "Khoa Trinh"] },
    { role: "Concept Artists", names: ["Khang Nguyen", "Long An"] },
    { role: "Chief Animation Supervisors", names: ["Alejandro Jhon Belen"] },
    { role: "Animation Supervisors", names: ["Alejandro Jhon Belen", "Thuy Vy"] },
    { role: "LO Animators", names: ["Huu Tu", "Lucas", "Aisha", "Cesar D. deLeon JR", "Anya"] },
];

const FIXED_CREDITS_RIGHT_COLUMN_SOURCE: CreditGroup[] = [
    { role: "Genga Animators", names: ["Cariza Gabito", "Bonz Bolalin", "Wencis Nico", "Matiella Garia", "Raissa Vinny"] },
    { role: "Clean Ups Animators", names: ["Julius L. de Belen", "RC", "PewPew", "Mark"] },
    { role: "2DFX Animator", names: ["Viet Nguyen"] },
    { role: "Colorist", names: ["Long An", "Khang Nguyen"] },
    { role: "Background Artist", names: ["Giao Nguyen"] },
    { role: "Lead Compositing", names: ["Daniel Laney"] },
    { role: "Compositing Editors", names: ["Phuc Pham", "Loc", "Le Nguyen", "Lam Nguyen"] },
    { role: "Music Composer", names: ["Jakub Pietras"] },
    { role: "SFX and Mastering", names: ["Jordan Wilberg"] },
    { role: "Editor", names: ["Quang Nguyen"] },
];

const cloneCreditGroup = (group: CreditGroup): CreditGroup => ({
    role: group.role,
    names: [...group.names],
});

export const createFixedCreditsColumns = (): {
    leftColumn: CreditGroup[];
    rightColumn: CreditGroup[];
} => ({
    leftColumn: FIXED_CREDITS_LEFT_COLUMN_SOURCE.map(cloneCreditGroup),
    rightColumn: FIXED_CREDITS_RIGHT_COLUMN_SOURCE.map(cloneCreditGroup),
});
