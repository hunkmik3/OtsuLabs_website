"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./introduction.module.css";

export default function IntroductionSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const [count, setCount] = useState(0);
    const hasAnimatedRef = useRef(false);

    // Parallax effect — image shifts up on scroll to reveal text underneath
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current || !imageRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const scrollProgress = -rect.top;
            const parallaxOffset = scrollProgress * 0.15;
            imageRef.current.style.transform = `translateY(${-parallaxOffset}px)`;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Counter animation for "100M+"
    useEffect(() => {
        const el = counterRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimatedRef.current) {
                    hasAnimatedRef.current = true;
                    const duration = 2000;
                    const target = 100;
                    const start = performance.now();

                    const step = (timestamp: number) => {
                        const progress = Math.min((timestamp - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        }
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className={styles.introSection}>
            <div className={styles.introContent}>
                <div className={styles.introTextWrapper}>
                    <span className={styles.badge}>INTRODUCTION</span>
                    <p className={styles.introText}>
                        We are a lab for world class <br />storytelling. Thousands of <br />seconds of animation <br />shipped. <span ref={counterRef}>{count}M+</span> views <br />and climbing.
                    </p>
                </div>

                {/* Character image with parallax */}
                <div ref={imageRef} className={styles.introImageWrapper}>
                    <Image
                        src="/images/home/banner_production.png"
                        alt="Animation production"
                        width={1110}
                        height={1139}
                        className={styles.introImage}
                    />
                </div>
            </div>
        </section>
    );
}
