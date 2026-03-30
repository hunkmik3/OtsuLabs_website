import styles from './project.module.css';

export interface CreditGroup {
    role: string;
    names: string[];
}

interface CreditsSectionProps {
    title: string;
    leftColumn: CreditGroup[];
    rightColumn: CreditGroup[];
}

export default function CreditsSection({
    title,
    leftColumn,
    rightColumn,
}: CreditsSectionProps) {
    const avatarPalette = [
        styles.creditsAvatarBlue,
        styles.creditsAvatarGreen,
        styles.creditsAvatarCyan,
        styles.creditsAvatarRed,
        styles.creditsAvatarAmber,
        styles.creditsAvatarPurple,
    ];

    const getAvatarClass = (name: string) => {
        const hash = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return avatarPalette[hash % avatarPalette.length];
    };

    const renderGroup = (group: CreditGroup) => (
        <article key={group.role} className={styles.creditsGroup}>
            <h3 className={styles.creditsRole}>{group.role}</h3>
            <div className={styles.creditsNames}>
                {group.names.map((name) => (
                    <span key={`${group.role}-${name}`} className={styles.creditsNamePill}>
                        <span className={`${styles.creditsAvatar} ${getAvatarClass(name)}`} />
                        <span>{name}</span>
                    </span>
                ))}
            </div>
        </article>
    );

    return (
        <section className={styles.creditsSection}>
            <div className={styles.creditsLayout}>
                <div className={styles.creditsIntro}>
                    <h2 className={styles.creditsTitle}>{title}</h2>
                    <span className={`${styles.creditsBadge} badge-animate`}>Credits</span>
                </div>

                <div className={styles.creditsColumn}>
                    {leftColumn.map(renderGroup)}
                </div>

                <div className={styles.creditsColumn}>
                    {rightColumn.map(renderGroup)}
                </div>
            </div>
        </section>
    );
}
