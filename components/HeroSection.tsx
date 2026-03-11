"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./hero.module.css";

const locations = [
    { name: "Seoul, South Korea", tz: "Asia/Seoul" },
    { name: "HCMC, Vietnam", tz: "Asia/Ho_Chi_Minh" },
    { name: "Manila, Philippines", tz: "Asia/Manila" },
    { name: "Los Angeles, US", tz: "America/Los_Angeles" },
    { name: "Hong Kong", tz: "Asia/Hong_Kong" },
];

function formatTime(tz: string) {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}

function getGMTOffset(tz: string) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en", {
        timeZone: tz,
        timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const offset = parts.find((p) => p.type === "timeZoneName");
    return offset?.value?.replace("GMT", "GMT ") || "";
}

export default function HeroSection() {
    const [times, setTimes] = useState<Record<string, string>>({});
    const [offsets, setOffsets] = useState<Record<string, string>>({});

    useEffect(() => {
        // Set offsets once
        const offs: Record<string, string> = {};
        locations.forEach((loc) => {
            offs[loc.tz] = getGMTOffset(loc.tz);
        });
        setOffsets(offs);

        // Update times every second
        const update = () => {
            const t: Record<string, string> = {};
            locations.forEach((loc) => {
                t[loc.tz] = formatTime(loc.tz);
            });
            setTimes(t);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.hero}>
            <div className={styles.imageWrapper}>
                <Image
                    src="/images/home/hero_banner.png"
                    alt="Hero Banner"
                    width={1440}
                    height={900}
                    className={styles.image}
                    priority
                />
            </div>

            <div className={styles.overlay}>
                <h1 className={styles.heading}>
                    We Animate Like<br />Scientists. Or Madmen
                </h1>

                <div className={styles.clocksRow}>
                    {locations.map((loc) => (
                        <div key={loc.tz} className={styles.clockItem}>
                            <span className={styles.cityName}>{loc.name}</span>
                            <span className={styles.clockTime}>
                                {times[loc.tz] || "00:00:00"} {offsets[loc.tz] || ""}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
