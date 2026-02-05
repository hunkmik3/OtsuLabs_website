import Image from "next/image";
import styles from "./selected-works.module.css";

const works = [
    {
        id: 1,
        title: "Nova Thera: Initation",
        description: "A short project description goes here",
        image: "/images/home/selected_works_1.png",
    },
    // Add more placeholder items for the stickiness later if needed
];

export default function SelectedWorksSection() {
    return (
        <section className={styles.section}>
            {/* Header */}
            <div>
                <h2 className={styles.title}>
                    Selected works
                    <svg
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={styles.arrowIcon}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </h2>
            </div>

            {/* Metadata Bar */}
            <div className={styles.metadataBar}>
                <span className={styles.yearBadge}>22-25</span>
                <span className={styles.clientInfo}>CLIENT: PIXELMON OFFICIAL ANIME | OTSU LABS COLLECTION</span>
            </div>

            {/* Works List (Sticky Cards) */}
            <div className={styles.worksList}>
                {works.map((work, index) => (
                    <div key={work.id} className={styles.card}>
                        <div className={styles.mediaContainer}>
                            {/* Using a placeholder div if image doesn't exist, or try to load a generic placeholder */}
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#333' }}>
                                {/* Replace with actual Image when available. Using VideoSection placeholder logic for now or a solid color with View Project btn */}
                                {/* For visual accuracy with the prompt, I'll attempt to use an existing image or just the button */}
                                <Image
                                    src={work.image}
                                    alt={work.title}
                                    width={1400}
                                    height={800}
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                    className={styles.mediaImage}
                                />
                            </div>
                            <button className={styles.viewButton}>VIEW PROJECT</button>
                        </div>
                        <div className={styles.cardFooter}>
                            <div className={styles.textInfo}>
                                <h3>{work.title}</h3>
                                <p>{work.description}</p>
                            </div>
                            <div className={styles.counter}>{index + 1}/3</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
