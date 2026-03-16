import { getCmsConfig, type CmsLogLevel } from "@/lib/cms/config";

type LogDetails = Record<string, unknown> | undefined;

const LOG_LEVEL_ORDER: Record<CmsLogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};

const normalizeError = (error: unknown) => {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    }

    return {
        value: error,
    };
};

const canLog = (level: CmsLogLevel) => {
    const configuredLevel = getCmsConfig().logging.level;
    return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[configuredLevel];
};

const buildPayload = (level: CmsLogLevel, message: string, details?: LogDetails) => ({
    ts: new Date().toISOString(),
    level,
    message,
    ...(details ? { details } : {}),
});

const stringifyPayload = (payload: ReturnType<typeof buildPayload>) => {
    if (getCmsConfig().logging.pretty) {
        return JSON.stringify(payload, null, 2);
    }
    return JSON.stringify(payload);
};

const write = (level: CmsLogLevel, message: string, details?: LogDetails) => {
    if (!canLog(level)) return;

    const payload = stringifyPayload(buildPayload(level, message, details));

    if (level === "error") {
        console.error(payload);
        return;
    }

    if (level === "warn") {
        console.warn(payload);
        return;
    }

    console.log(payload);
};

export const cmsLogger = {
    debug: (message: string, details?: LogDetails) => write("debug", message, details),
    info: (message: string, details?: LogDetails) => write("info", message, details),
    warn: (message: string, details?: LogDetails) => write("warn", message, details),
    error: (message: string, details?: LogDetails) => write("error", message, details),
    normalizeError,
};

