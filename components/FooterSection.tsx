import styles from './footer.module.css';

export default function FooterSection() {
    return (
        <footer className={styles.footer}>
            <div className={styles.topContent}>
                <div className={styles.headingBlock}>
                    <h2 className={styles.title}>Let's set your brand in motion.</h2>
                    <a href="mailto:contact@otsulabs.com" className={styles.email}>contact@otsulabs.com</a>
                </div>

                <div className={styles.linksContainer}>
                    <div className={styles.col}>
                        <a href="#" className={styles.link}>ABOUT</a>
                        <a href="#" className={styles.link}>PROJECTS</a>
                        <a href="#" className={styles.link}>JOIN US</a>
                        <a href="#" className={styles.link}>CONTACT</a>
                    </div>
                    <div className={styles.col}>
                        <a href="#" className={styles.link}>LINKEDIN</a>
                        <a href="#" className={styles.link}>INSTAGRAM</a>
                        <a href="#" className={styles.link}>TWITTER</a>
                        <a href="#" className={styles.link}>VIMEO</a>
                    </div>
                </div>
            </div>



            {/* Character Image */}
            <img
                src="/images/home/otsu character.png"
                alt="Otsu Character"
                className={styles.characterImage}
            />

            <div className={styles.bottomContent}>
                <div className={styles.legal}>
                    <span>PRIVACY POLICY</span>
                    <span>© 2024 Otsu Labs. All rights reserved.</span>
                </div>

                <div className={styles.locations}>
                    <div className={styles.locationItem}>
                        <span>Seoul, South Korea</span>
                        <span>16:32:54 GMT +09:00</span>
                    </div>
                    <div className={styles.locationItem}>
                        <span>HCMC, Vietnam</span>
                        <span>16:32:54 GMT +07:00</span>
                    </div>
                    <div className={styles.locationItem}>
                        <span>Manila, Philippines</span>
                        <span>16:32:54 GMT +08:00</span>
                    </div>
                    <div className={styles.locationItem}>
                        <span>Los Angeles, US</span>
                        <span>16:32:54 GMT -07:00</span>
                    </div>
                    <div className={styles.locationItem}>
                        <span>Hong Kong</span>
                        <span>16:32:54 GMT +08:00</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
