'use client';

import { useEffect, useRef, useState, ReactNode, CSSProperties } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade' | 'scale';
    delay?: number;
    duration?: number;
    distance?: number;
    threshold?: number;
}

export default function ScrollReveal({
    children,
    className,
    style,
    animation = 'fade-up',
    delay = 0,
    duration = 0.8,
    distance = 30,
    threshold = 0.15,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    const getInitialTransform = (): string => {
        switch (animation) {
            case 'fade-up': return `translateY(${distance}px)`;
            case 'fade-down': return `translateY(-${distance}px)`;
            case 'fade-left': return `translateX(${distance}px)`;
            case 'fade-right': return `translateX(-${distance}px)`;
            case 'scale': return 'scale(0.95)';
            case 'fade': return 'none';
        }
    };

    const animStyle: CSSProperties = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getInitialTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
        ...style,
    };

    return (
        <div ref={ref} className={className} style={animStyle}>
            {children}
        </div>
    );
}
