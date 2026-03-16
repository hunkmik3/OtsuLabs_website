import { CmsApiError } from "@/lib/cms/api-response";
import { cmsLogger } from "@/lib/cms/logger";

interface ContactPayload {
    name: string;
    email: string;
    company?: string;
    message: string;
    website?: string;
    formStartedAt?: number;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;
const MIN_FORM_FILL_MS = 1200;

const requestWindowByIp = new Map<string, number[]>();

const asNonEmptyString = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0 ? value.trim() : "";

const asOptionalString = (value: unknown) =>
    typeof value === "string" ? value.trim() : "";

const getClientIp = (request: Request) => {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim() || "unknown";
    }
    return request.headers.get("x-real-ip") || "unknown";
};

const ensureRateLimit = (ip: string) => {
    const now = Date.now();
    const current = requestWindowByIp.get(ip) || [];
    const filtered = current.filter((timestamp) => now - timestamp < WINDOW_MS);

    if (filtered.length >= MAX_SUBMISSIONS_PER_WINDOW) {
        throw new CmsApiError(
            429,
            "RATE_LIMITED",
            "Too many submissions from this IP. Please try again later."
        );
    }

    filtered.push(now);
    requestWindowByIp.set(ip, filtered);
};

const validatePayload = (payload: unknown): ContactPayload => {
    const body = (payload ?? {}) as Record<string, unknown>;
    const name = asNonEmptyString(body.name);
    const email = asNonEmptyString(body.email).toLowerCase();
    const company = asOptionalString(body.company);
    const message = asNonEmptyString(body.message);
    const website = asOptionalString(body.website);
    const formStartedAt = typeof body.formStartedAt === "number" ? body.formStartedAt : undefined;

    if (!name || name.length < 2 || name.length > 120) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "name must be between 2 and 120 characters.");
    }
    if (!email || !EMAIL_PATTERN.test(email)) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "email is invalid.");
    }
    if (company.length > 120) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "company must be at most 120 characters.");
    }
    if (!message || message.length < 10 || message.length > 2000) {
        throw new CmsApiError(400, "VALIDATION_ERROR", "message must be between 10 and 2000 characters.");
    }
    if (website.length > 0) {
        throw new CmsApiError(400, "SPAM_DETECTED", "Submission rejected.");
    }
    if (formStartedAt && Date.now() - formStartedAt < MIN_FORM_FILL_MS) {
        throw new CmsApiError(400, "SPAM_DETECTED", "Submission rejected.");
    }

    return {
        name,
        email,
        company: company || undefined,
        message,
        website,
        formStartedAt,
    };
};

export const submitContactLead = async (request: Request, payload: unknown) => {
    const ip = getClientIp(request);
    ensureRateLimit(ip);
    const validated = validatePayload(payload);

    cmsLogger.info("Contact lead captured.", {
        email: validated.email,
        hasCompany: !!validated.company,
        messageLength: validated.message.length,
        ip,
    });

    return {
        accepted: true,
    };
};
