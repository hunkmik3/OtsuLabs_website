"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./otsu-has-packed.module.css";

const projects = [
    { name: "One Piece", role: "Key Animation", year: "1999", image: "/images/about/image/otsu has packed session/one_peace.png", shiftRole: true },
    { name: "Bleach", role: "Key Animation", year: "2022", image: "/images/about/image/otsu has packed session/bleach.png", shiftRole: true },
    { name: "Vinland Saga", role: "Animation Direction", year: "2019", image: "/images/about/image/otsu has packed session/vinland.png" },
    { name: "Dan Da Dan", role: "2nd Key Animation", year: "2018", image: "/images/about/image/otsu has packed session/dan da dan.png" },
    { name: "Pokémon", role: "2nd Key Animation", year: "2023", image: "/images/about/image/otsu has packed session/pokemon.png" },
    { name: "Rising of the shield Hero", role: "2nd Key Animation", year: "2022", image: "/images/about/image/otsu has packed session/rising of the shield.png" },
    { name: "Hell\u2019s Paradise", role: "2nd Key Animation", year: "2018", image: "/images/about/image/otsu has packed session/hells paradise.png" },
];

export default function OtsuHasPackedSection() {
    const [showAll, setShowAll] = useState(false);
    const seeMoreRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        const next = !showAll;
        setShowAll(next);
        if (next) {
            setTimeout(() => {
                seeMoreRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
            }, 100);
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.badge}>OTSU HAS PACKED</div>

            <h2 className={styles.heading}>
                Our team members have<br />
                hands-on experience working<br />
                on iconic anime shows.
            </h2>

            <div className={`${styles.strips} ${showAll ? styles.stripsExpanded : ''}`}>
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className={`${styles.strip} ${index >= 4 ? styles.stripExtra : ''} ${index >= 4 && showAll ? styles.stripExtraVisible : ''}`}
                    >
                        <Image
                            src={project.image}
                            alt={project.name}
                            width={1920}
                            height={400}
                            className={styles.stripImage}
                        />
                        <div className={styles.stripContent}>
                            <span className={styles.label}>{project.name}</span>
                            <span className={`${styles.label} ${project.shiftRole ? styles.labelShifted : ''}`}>{project.role}</span>
                            <span className={styles.label}>{project.year}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button ref={seeMoreRef} className={styles.seeMore} onClick={handleToggle}>
                {showAll ? 'HIDE −' : 'SEE MORE +'}
            </button>
        </section>
    );
}
