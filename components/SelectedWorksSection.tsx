import Image from "next/image";
import styles from "./selected-works.module.css";
import RollingText from "./RollingText";

const works = [
    {
        id: 1,
        title: "Nova Thera: Initation",
        description: "A short project description goes here",
        type: "image" as const,
        src: "/images/home/selected_works_1.png",
    },
    {
        id: 2,
        title: "Project Placeholder 2",
        description: "A short project description goes here",
        type: "video" as const,
        src: "/images/home/showreels.mp4",
    },
    {
        id: 3,
        title: "Project Placeholder 3",
        description: "A short project description goes here",
        type: "image" as const,
        src: "/images/home/Hero Section.png",
    },
];

export default function SelectedWorksSection() {
    return (
        <section className={styles.section}>
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

            <div className={styles.metadataBar}>
                <span className={`${styles.yearBadge} badge-animate`}>22-25</span>
                <span className={styles.clientInfo}>CLIENT: PIXELMON OFFICIAL ANIME | OTSU LABS COLLECTION</span>
            </div>

            <div className={styles.worksList}>
                {works.map((work, index) => (
                    <article key={work.id} className={styles.card}>
                        <div className={styles.mediaContainer}>
                            {work.type === "video" ? (
                                <video
                                    src={work.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className={styles.mediaVideo}
                                />
                            ) : (
                                <Image
                                    src={work.src}
                                    alt={work.title}
                                    fill
                                    className={styles.mediaImage}
                                    sizes="(max-width: 1024px) 100vw, 92vw"
                                />
                            )}
                            <button className={`${styles.viewButton} roll-trigger`} aria-label="View project">
                                <RollingText text="VIEW PROJECT" />
                            </button>
                        </div>
                        <div className={styles.cardFooter}>
                            <div className={styles.textInfo}>
                                <h3>{work.title}</h3>
                                <p>{work.description}</p>
                            </div>
                            <div className={styles.counter}>
                                {index + 1}/{works.length}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
