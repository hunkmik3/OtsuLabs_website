import Image from "next/image";
import styles from "./clients.module.css";

// Placeholder logos for rows 2 and 3 - replace with actual client logos later
const row2Logos = [
    { name: "Client 7", id: 7 },
    { name: "Client 8", id: 8 },
    { name: "Client 9", id: 9 },
    { name: "Client 10", id: 10 },
    { name: "Client 11", id: 11 },
    { name: "Client 12", id: 12 },
];

const row3Logos = [
    { name: "Client 13", id: 13 },
    { name: "Client 14", id: 14 },
    { name: "Client 15", id: 15 },
    { name: "Client 16", id: 16 },
    { name: "Client 17", id: 17 },
    { name: "Client 18", id: 18 },
];

export default function ClientsSection() {
    return (
        <section className={styles.clientsSection}>
            <div className={styles.clientsHeader}>
                <span className={styles.badge}>OUR CLIENTS</span>
                <p className={styles.description}>
                    Otsu Labs is a creative studio crafting frame-by-frame animation for
                    advertising, social media, tv, and beyond.
                </p>
            </div>

            <div className={styles.logoContainer}>
                {/* Row 1 - Full image with 6 logos */}
                <div className={styles.logoRow}>
                    <Image
                        src="/images/home/Row 1.png"
                        alt="Client logos row 1"
                        width={1200}
                        height={60}
                        className={styles.logoRowImage}
                    />
                </div>

                {/* Row 2 - Full image with 6 logos */}
                <div className={styles.logoRow}>
                    <Image
                        src="/images/home/Row 2.png"
                        alt="Client logos row 2"
                        width={1200}
                        height={60}
                        className={styles.logoRowImage}
                    />
                </div>

                {/* Row 3 - Full image with logos */}
                <div className={styles.logoRow}>
                    <Image
                        src="/images/home/Row 3.png"
                        alt="Client logos row 3"
                        width={1200}
                        height={60}
                        className={styles.logoRowImage}
                    />
                </div>
            </div>
        </section>
    );
}
