const SESSION_VERSION = "v1";

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();

interface SessionPayload {
    v: string;
    iat: number;
    exp: number;
}

interface VerifySessionResult {
    valid: boolean;
    reason?: string;
}

const toBase64Url = (bytes: Uint8Array) => {
    if (typeof Buffer !== "undefined") {
        return Buffer.from(bytes)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/g, "");
    }

    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const fromBase64Url = (value: string) => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

    if (typeof Buffer !== "undefined") {
        return new Uint8Array(Buffer.from(padded, "base64"));
    }

    const binary = atob(padded);
    const output = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
        output[index] = binary.charCodeAt(index);
    }
    return output;
};

const timingSafeEqual = (left: string, right: string) => {
    if (left.length !== right.length) return false;
    let mismatch = 0;
    for (let index = 0; index < left.length; index += 1) {
        mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }
    return mismatch === 0;
};

const createHmacSha256 = async (secret: string, message: string) => {
    const key = await crypto.subtle.importKey(
        "raw",
        utf8Encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, utf8Encoder.encode(message));
    return toBase64Url(new Uint8Array(signature));
};

export const createAdminSessionCookieValue = async (input: {
    authSecret: string;
    ttlSeconds: number;
    nowMs?: number;
}) => {
    const nowMs = input.nowMs ?? Date.now();
    const payload: SessionPayload = {
        v: SESSION_VERSION,
        iat: Math.floor(nowMs / 1000),
        exp: Math.floor(nowMs / 1000) + Math.max(60, Math.floor(input.ttlSeconds)),
    };

    const payloadBase64 = toBase64Url(utf8Encoder.encode(JSON.stringify(payload)));
    const signature = await createHmacSha256(input.authSecret, payloadBase64);
    return `${payloadBase64}.${signature}`;
};

export const verifyAdminSessionCookieValue = async (input: {
    cookieValue: string | null | undefined;
    authSecret: string;
    nowMs?: number;
}): Promise<VerifySessionResult> => {
    if (!input.cookieValue) {
        return { valid: false, reason: "missing_cookie" };
    }
    if (!input.authSecret) {
        return { valid: false, reason: "missing_secret" };
    }

    const [payloadBase64, providedSignature] = input.cookieValue.split(".");
    if (!payloadBase64 || !providedSignature) {
        return { valid: false, reason: "invalid_format" };
    }

    const expectedSignature = await createHmacSha256(input.authSecret, payloadBase64);
    if (!timingSafeEqual(expectedSignature, providedSignature)) {
        return { valid: false, reason: "invalid_signature" };
    }

    let payload: SessionPayload;
    try {
        payload = JSON.parse(utf8Decoder.decode(fromBase64Url(payloadBase64))) as SessionPayload;
    } catch {
        return { valid: false, reason: "invalid_payload" };
    }

    if (payload.v !== SESSION_VERSION) {
        return { valid: false, reason: "unsupported_version" };
    }

    const nowSec = Math.floor((input.nowMs ?? Date.now()) / 1000);
    if (!Number.isFinite(payload.iat) || payload.iat > nowSec + 300) {
        return { valid: false, reason: "invalid_iat" };
    }
    if (!Number.isFinite(payload.exp) || payload.exp <= payload.iat) {
        return { valid: false, reason: "invalid_exp" };
    }
    if (payload.exp <= nowSec) {
        return { valid: false, reason: "expired" };
    }

    return { valid: true };
};
