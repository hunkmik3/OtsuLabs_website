import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link href="/">
                    <Image
                        src="/images/home/Frame 1948755263.png"
                        alt="OtsuLabs Logo"
                        width={50}
                        height={50}
                        style={{ width: 'auto', height: '30px' }}
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
        </header>
    );
}
