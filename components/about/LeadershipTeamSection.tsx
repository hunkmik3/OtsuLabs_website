import Image from "next/image";
import styles from "./leadership-team.module.css";

const rows = [
    [
        { name: "Khoa Trinh", role: "CEO/Executive Producer", avatar: "/images/home/icon/image 171.svg" },
        { name: "Noa Kang", role: "COO/Executive Producer", avatar: "/images/home/icon/image 172.svg" },
    ],
    [
        { name: "Raymond", role: "CPO/Executive Producer", avatar: "/images/home/icon/image 173.svg" },
        { name: "Carl Choi", role: "LA-Based Executive Producer", avatar: "/images/home/icon/image 174.svg" },
        { name: "Hieu", role: "Line Producer", avatar: "/images/home/icon/image 175.svg" },
    ],
    [
        { name: "AJ", role: "Animation Director", avatar: "/images/home/icon/image 176.svg" },
        { name: "Huu Tu", role: "Animation Director", avatar: "/images/home/icon/image 177.svg" },
        { name: "Holo", role: "Art Director & Color Designer", avatar: "/images/home/icon/image 178.svg" },
    ],
    [
        { name: "Long An", role: "Art Director", avatar: "/images/home/icon/image 180.svg" },
        { name: "Haru", role: "Artist & Color Designer", avatar: "/images/home/icon/image 181.svg" },
        { name: "Julius De Belen", role: "Production Coordinator", avatar: "/images/home/icon/image 182.svg" },
    ],
    [
        { name: "Kami", role: "Chief Key Animator", avatar: "/images/home/icon/image 183.svg" },
        { name: "Daioneer", role: "Key Animator", avatar: "/images/home/icon/image 171.svg" },
        { name: "Tram Nguyen", role: "Line Producer", avatar: "/images/home/icon/image 173.svg" },
    ],
    [
        { name: "Thuan", role: "CG Supervisor", avatar: "/images/home/icon/image 175.svg" },
        { name: "Diem Nguyen", role: "Head of HR", avatar: "/images/home/icon/image 178.svg" },
    ],
];

export default function LeadershipTeamSection() {
    return (
        <section className={styles.section}>
            <div className={styles.badge}>LEADERSHIP TEAM</div>

            <h2 className={styles.heading}>
                Meet Otsu&apos;s Scientists ↓
            </h2>

            <div className={styles.grid}>
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.row}>
                        {row.map((member, index) => (
                            <div key={index} className={styles.member}>
                                <span className={styles.name}>
                                    <Image
                                        src={member.avatar}
                                        alt={member.name}
                                        width={40}
                                        height={40}
                                        className={styles.avatar}
                                    />
                                    {member.name}
                                </span>
                                <span className={styles.role}>{member.role}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}
