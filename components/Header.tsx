'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.logoContainer}>
                    <Link href="/">
                        <Image
                            src="/images/home/Frame 1948755263.png"
                            alt="OtsuLabs Logo"
                            width={50}
                            height={50}
                            className={styles.logoImage}
                            priority
                        />
                    </Link>
                </div>
                <nav className={styles.nav}>
                    <Link href="/about" className={styles.navLink}>
                        ABOUT
                    </Link>
                    <Link href="/work" className={styles.navLink}>
                        WORK
                    </Link>
                    <Link href="/contact" className={styles.navLink}>
                        CONTACT
                    </Link>
                </nav>
                <a href="mailto:contact@otsulabs.com" className={styles.contactLink}>
                    CONTACT@OTSULABS.COM
                </a>

                {/* Mobile hamburger */}
                <button
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </header>

            {/* Mobile slide-in menu */}
            <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`} onClick={() => setMenuOpen(false)} />
            <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
                <div className={styles.mobileMenuHeader}>
                    <div className={styles.mobileMenuLogo}>
                        <Link href="/" onClick={() => setMenuOpen(false)}>
                            <Image
                                src="/images/home/Frame 1948755263.png"
                                alt="OtsuLabs Logo"
                                width={50}
                                height={50}
                                className={styles.logoImage}
                            />
                        </Link>
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <line x1="6" y1="6" x2="18" y2="18" />
                            <line x1="18" y1="6" x2="6" y2="18" />
                        </svg>
                    </button>
                </div>

                <nav className={styles.mobileNav}>
                    <Link href="/about" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>ABOUT</Link>
                    <Link href="/work" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>WORK</Link>
                    <Link href="/contact" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>CONTACT</Link>
                </nav>

                <a href="mailto:contact@otsulabs.com" className={styles.mobileContactLink} onClick={() => setMenuOpen(false)}>
                    CONTACT@OTSULABS.COM
                </a>
            </div>
        </>
    );
}
