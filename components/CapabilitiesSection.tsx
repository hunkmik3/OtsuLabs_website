import Image from "next/image";
import styles from "./capabilities.module.css";

const capabilities = [
    { name: "Creative Direction", icon: "/images/home/icon/image 173.svg" },
    { name: "Script Writing", icon: "/images/home/icon/image 183.svg" },
    { name: "Animation Production", icon: "/images/home/icon/image 182.svg" },
    { name: "Storyboard", icon: "" },
    { name: "Narrative Design", icon: "/images/home/icon/image 174.svg" },
    { name: "Cinematic Planning", icon: "/images/home/icon/image 175.svg" },
    { name: "Stillomatic", icon: "/images/home/icon/image 181.svg" },
    { name: "Compositing & Finishing", icon: "" },
    { name: "Visual Effects", icon: "/images/home/icon/image 171.svg" },
    { name: "Sound Effects", icon: "/images/home/icon/image 172.svg" },
    { name: "Voice Acting & Casting", icon: "/images/home/icon/image 178.svg" },
    { name: "Score & Sound Design", icon: "" },
    { name: "Concept Art", icon: "/images/home/icon/image 177.svg" },
    { name: "Visual Development", icon: "/images/home/icon/image 178.svg" },
    { name: "Character Design", icon: "/images/home/icon/image 180.svg" },
    { name: "Environment Design", icon: "" },
];

export default function CapabilitiesSection() {
    return (
        <section className={styles.section}>
            <div className={styles.topContainer}>
                <div className={styles.badge}>CAPABILITIES</div>
                <p className={styles.description}>
                    Animation for brands, screens, and <br />stories of every scale. We're your <br />creative partner, equipped to tackle <br />any challenge. Delivering A-Z or<br /> tailored solutions.
                </p>
            </div>

            <div className={styles.tagsContainer}>
                {capabilities.map((cap, index) => (
                    <div key={index} className={styles.tag}>
                        {cap.name}
                        {cap.icon && (
                            <span>
                                {cap.icon.includes('.svg') ? (
                                    <Image
                                        src={cap.icon}
                                        alt={cap.name}
                                        width={52}
                                        height={52}
                                        style={{ display: 'inline-block', verticalAlign: 'middle' }}
                                    />
                                ) : (
                                    cap.icon
                                )}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
