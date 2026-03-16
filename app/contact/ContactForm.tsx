"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./contact.module.css";

interface ContactFormState {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
    website: string;
}

const INITIAL_STATE: ContactFormState = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
    website: "",
};

export default function ContactForm() {
    const router = useRouter();
    const [formState, setFormState] = useState<ContactFormState>(INITIAL_STATE);
    const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [formStartedAt] = useState(() => Date.now());

    const canSubmit = useMemo(
        () =>
            status !== "submitting" &&
            formState.firstName.trim().length > 0 &&
            formState.email.trim().length > 0 &&
            formState.message.trim().length > 0,
        [formState.email, formState.message, formState.firstName, status]
    );

    const setField = <T extends keyof ContactFormState>(field: T, value: ContactFormState[T]) => {
        setFormState((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit) return;

        setStatus("submitting");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: `${formState.firstName} ${formState.lastName}`.trim(),
                    email: formState.email,
                    phone: formState.phone,
                    message: formState.message,
                    website: formState.website,
                    formStartedAt,
                }),
            });

            const payload = (await response.json()) as {
                success?: boolean;
                error?: { message?: string };
            };

            if (!response.ok || !payload.success) {
                setStatus("error");
                setErrorMessage(payload.error?.message || "Unable to submit the contact form.");
                return;
            }

            setFormState(INITIAL_STATE);
            router.push("/contact/thank-you");
            router.refresh();
        } catch {
            setStatus("error");
            setErrorMessage("Unexpected server error.");
        } finally {
            setStatus((current) => (current === "error" ? "error" : "idle"));
        }
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.rowTwo}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="First Name"
                    aria-label="First Name"
                    value={formState.firstName}
                    onChange={(event) => setField("firstName", event.target.value)}
                    required
                />
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Last Name"
                    aria-label="Last Name"
                    value={formState.lastName}
                    onChange={(event) => setField("lastName", event.target.value)}
                />
            </div>

            <input
                type="tel"
                className={styles.input}
                placeholder="Phone Number"
                aria-label="Phone Number"
                value={formState.phone}
                onChange={(event) => setField("phone", event.target.value)}
            />

            <input
                type="email"
                className={styles.input}
                placeholder="Your Email"
                aria-label="Your Email"
                value={formState.email}
                onChange={(event) => setField("email", event.target.value)}
                required
            />

            <textarea
                className={`${styles.input} ${styles.textarea}`}
                placeholder="How can we help?"
                aria-label="How can we help?"
                value={formState.message}
                onChange={(event) => setField("message", event.target.value)}
                required
            />

            <label className={styles.uploadRow}>
                <span className={styles.uploadIcon}>🔗</span>
                <span>Upload File</span>
                <input type="file" className={styles.fileInput} />
            </label>

            <input
                type="text"
                className={styles.honeypotInput}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={formState.website}
                onChange={(event) => setField("website", event.target.value)}
            />

            {errorMessage ? (
                <p className={`${styles.formMessage} ${styles.formMessageError}`}>{errorMessage}</p>
            ) : null}

            <button type="submit" className={styles.submitButton} disabled={!canSubmit}>
                {status === "submitting" ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
}
