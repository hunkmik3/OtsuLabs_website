'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './footer.module.css';
import ScrollReveal from './ScrollReveal';
import RollingText from './RollingText';

const locations = [
    { name: 'Seoul, South Korea', tz: 'Asia/Seoul', offset: '+09:00' },
    { name: 'HCMC, Vietnam', tz: 'Asia/Ho_Chi_Minh', offset: '+07:00' },
    { name: 'Manila, Philippines', tz: 'Asia/Manila', offset: '+08:00' },
    { name: 'Los Angeles, US', tz: 'America/Los_Angeles', offset: '-07:00' },
    { name: 'Hong Kong', tz: 'Asia/Hong_Kong', offset: '+08:00' },
];

const mobileLocations = [
    { name: 'South Korea', tz: 'Asia/Seoul' },
    { name: 'Saigon, Vietnam', tz: 'Asia/Ho_Chi_Minh' },
];

function getTimeForTz(tz: string) {
    return new Date().toLocaleTimeString('en-GB', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

export default function FooterSection() {
    const [times, setTimes] = useState<string[]>([]);

    useEffect(() => {
        const update = () => setTimes(locations.map(l => getTimeForTz(l.tz)));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className={styles.footer}>
            <ScrollReveal>
                <div className={styles.topContent}>
                    <div className={styles.headingBlock}>
                        <h2 className={styles.title}>Let's set your brand in motion.</h2>
                        <a href="mailto:contact@otsulabs.com" className={`${styles.email} roll-trigger`} aria-label="contact@otsulabs.com">
                            <RollingText text="contact@otsulabs.com" />
                        </a>
                    </div>

                    <div className={styles.linksContainer}>
                        <div className={styles.col}>
                            <Link href="/about" className={`${styles.link} roll-trigger`} aria-label="About">
                                <RollingText text="ABOUT" />
                            </Link>
                            <Link href="/work" className={`${styles.link} roll-trigger`} aria-label="Projects">
                                <RollingText text="PROJECTS" />
                            </Link>
                            <span className={`${styles.link} roll-trigger`} aria-label="Join us">
                                <RollingText text="JOIN US" />
                            </span>
                            <Link href="/contact" className={`${styles.link} roll-trigger`} aria-label="Contact">
                                <RollingText text="CONTACT" />
                            </Link>
                        </div>
                        <div className={styles.col}>
                            <a href="https://www.linkedin.com/company/otsulabs/" target="_blank" rel="noreferrer" className={`${styles.link} roll-trigger`} aria-label="LinkedIn">
                                <RollingText text="LINKEDIN" />
                            </a>
                            <a href="https://www.instagram.com/otsulabs/" target="_blank" rel="noreferrer" className={`${styles.link} roll-trigger`} aria-label="Instagram">
                                <RollingText text="INSTAGRAM" />
                            </a>
                            <a href="https://x.com/OtsuLabs" target="_blank" rel="noreferrer" className={`${styles.link} roll-trigger`} aria-label="Twitter">
                                <RollingText text="TWITTER" />
                            </a>
                            <a href="https://vimeo.com/otsulabs" target="_blank" rel="noreferrer" className={`${styles.link} roll-trigger`} aria-label="Vimeo">
                                <RollingText text="VIMEO" />
                            </a>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Character Image */}
            <ScrollReveal animation="scale" delay={0.15}>
                <img
                    src="/images/home/otsu character.png"
                    alt="Otsu Character"
                    className={styles.characterImage}
                />
            </ScrollReveal>

            <div className={styles.bottomContent}>
                <div className={styles.legal}>
                    <Link href="/privacy-policy">PRIVACY POLICY</Link>
                    <Link href="/cookies-policy">COOKIES</Link>
                    <Link href="/terms">TERMS</Link>
                    <span>© 2024 Otsu Labs. All rights reserved.</span>
                </div>

                <div className={styles.locations}>
                    {locations.map((loc, i) => (
                        <div key={loc.tz} className={styles.locationItem}>
                            <span>{loc.name}</span>
                            <span>{times[i] ?? '--:--:--'} GMT {loc.offset}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.mobileLocations}>
                    {mobileLocations.map((loc) => (
                        <div key={loc.tz} className={styles.mobileLocationItem}>
                            <span className={styles.mobileLocationName}>{loc.name}</span>
                            <span className={styles.mobileLocationTime}>{times[locations.findIndex(l => l.tz === loc.tz)] ?? '--:--:--'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}
