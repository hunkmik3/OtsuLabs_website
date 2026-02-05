"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./video.module.css";

export default function VideoSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTime, setCurrentTime] = useState("00:00:00");

    useEffect(() => {
        if (videoRef.current) {
            // Attempt autoplay
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log("Auto-play was prevented:", error);
                    setIsPlaying(false);
                });
            }
        }
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const time = videoRef.current.currentTime;

            // Format time as HH:MM:SS
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60);
            const seconds = Math.floor(time % 60);
            const format = (val: number) => `0${val}`.slice(-2);

            setCurrentTime(`${format(hours)}:${format(minutes)}:${format(seconds)}`);
        }
    };

    return (
        <section className={styles.videoSection}>
            <video
                ref={videoRef}
                className={styles.video}
                src="/images/home/showreels.mp4"
                loop
                muted={isMuted} /* Start muted for autoplay compatibility */
                playsInline
                onTimeUpdate={handleTimeUpdate}
            />

            <button className={styles.muteButton} onClick={toggleMute}>
                {isMuted ? "UNMUTE" : "MUTE"}
            </button>

            <button className={styles.playButton} onClick={togglePlay}>
                {isPlaying ? "PAUSE SHOWREEL" : "PLAY SHOWREEL"}
            </button>

            <div className={styles.bottomBar}>
                <span>2025 SHOWREEL</span>
                <span className={styles.bottomCenter}>{currentTime}</span>
                <span>OTSU LABS COLLECTION</span>
            </div>
        </section>
    );
}
