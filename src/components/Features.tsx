"use client";

import { useEffect, useState } from 'react';
import styles from './Features.module.css';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface AchievementToastProps {
    achievement: Achievement | null;
    onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
    useEffect(() => {
        if (achievement) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [achievement, onClose]);

    if (!achievement) return null;

    return (
        <div className={styles.achievementToast}>
            <div className={styles.achievementIcon}>{achievement.icon}</div>
            <div className={styles.achievementText}>
                <div className={styles.achievementTitle}>{achievement.title}</div>
                <div className={styles.achievementDesc}>{achievement.description}</div>
            </div>
        </div>
    );
}

interface StatsProps {
    sessionsCompleted: number;
    totalMinutes: number;
    streak: number;
}

export function StatsPanel({ sessionsCompleted, totalMinutes, streak }: StatsProps) {
    return (
        <div className={styles.statsPanel}>
            <div className={styles.statItem}>
                <span className={styles.statLabel}>Sessions</span>
                <span className={styles.statValue}>{sessionsCompleted}</span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.statLabel}>Minutes</span>
                <span className={styles.statValue}>{totalMinutes}</span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.statLabel}>Streak</span>
                <span className={styles.statValue}>{streak} 🔥</span>
            </div>
        </div>
    );
}

interface SoundToggleProps {
    isMuted: boolean;
    onToggle: () => void;
}

export function SoundToggle({ isMuted, onToggle }: SoundToggleProps) {
    return (
        <button
            className={`${styles.soundToggle} ${isMuted ? styles.muted : ''}`}
            onClick={onToggle}
            aria-label={isMuted ? "Unmute" : "Mute"}
        >
            {isMuted ? '🔇' : '🔊'}
        </button>
    );
}
