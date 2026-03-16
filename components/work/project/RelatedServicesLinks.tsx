import Link from "next/link";
import styles from "./related-services.module.css";

export interface RelatedServiceLink {
    slug: string;
    name: string;
    primaryKeyword: string;
}

interface RelatedServicesLinksProps {
    services: RelatedServiceLink[];
}

export default function RelatedServicesLinks({ services }: RelatedServicesLinksProps) {
    if (!services.length) {
        return null;
    }

    return (
        <section className={styles.section} aria-label="Related services">
            <p className={styles.eyebrow}>Related Services</p>
            <h2 className={styles.title}>Explore Services Related to This Project</h2>
            <div className={styles.grid}>
                {services.map((service) => (
                    <Link key={service.slug} href={`/services/${service.slug}`} className={styles.card}>
                        <p className={styles.keyword}>{service.primaryKeyword}</p>
                        <p className={styles.name}>{service.name}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
