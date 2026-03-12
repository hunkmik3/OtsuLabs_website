import Link from 'next/link';
import styles from './project.module.css';

export interface MoreProjectCard {
    slug: string;
    title: string;
    subtitle: string;
    image: string;
    year: string;
}

interface MoreProjectsSectionProps {
    cards: MoreProjectCard[];
}

export default function MoreProjectsSection({ cards }: MoreProjectsSectionProps) {
    const visibleCards = cards.slice(0, 2);

    return (
        <section className={styles.moreProjectsSection}>
            <div className={styles.moreProjectsHeader}>
                <h2 className={styles.moreProjectsTitle}>More Projects</h2>
                <Link href="/work" className={styles.moreProjectsBackLink}>
                    Back to Work <span aria-hidden="true">←</span>
                </Link>
            </div>

            <div className={styles.moreProjectsGrid}>
                {visibleCards.map((card) => (
                    <Link
                        key={card.slug}
                        href={`/work/${card.slug}`}
                        className={styles.moreProjectsCard}
                    >
                        <img
                            src={card.image}
                            alt={card.title}
                            className={styles.moreProjectsImage}
                        />
                        <div className={styles.moreProjectsCardMeta}>
                            <div className={styles.moreProjectsCardText}>
                                <p className={styles.moreProjectsCardTitle}>{card.title}</p>
                                <p className={styles.moreProjectsCardSubtitle}>{card.subtitle}</p>
                            </div>
                            <span className={styles.moreProjectsCardYear}>[{card.year}]</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
