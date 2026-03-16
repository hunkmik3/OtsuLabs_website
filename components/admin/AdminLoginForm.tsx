"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/admin/admin.module.css";

interface AdminLoginFormProps {
    nextPath: string;
}

interface LoginResponse {
    success: boolean;
    error?: {
        message?: string;
    };
}

export default function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const payload = (await response.json()) as LoginResponse;
            if (!response.ok || !payload.success) {
                throw new Error(payload.error?.message || "Login failed.");
            }

            router.push(nextPath);
            router.refresh();
        } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.adminPage} ${styles.adminPageSingle}`}>
            <section className={styles.adminPanel}>
                <h1 className={styles.adminTitle}>Admin Login</h1>
                <p className={styles.adminSubTitle}>Enter CMS admin token from environment configuration.</p>

                <div className={styles.field}>
                    <label className={styles.label}>Admin Token</label>
                    <input
                        className={styles.input}
                        type="password"
                        value={token}
                        onChange={(event) => setToken(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                void handleLogin();
                            }
                        }}
                    />
                </div>

                <div className={styles.row}>
                    <button className={styles.button} type="button" onClick={() => void handleLogin()} disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </div>

                {error ? <p className={`${styles.message} ${styles.error}`}>{error}</p> : null}
            </section>
        </div>
    );
}
