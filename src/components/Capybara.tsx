"use client";

import { useState } from 'react';
import styles from './Capybara.module.css';
import { CAPY_CHATS } from '@/data/chats';

interface CapybaraProps {
    isSleeping: boolean; // Idle state
    isDone: boolean; // Timer finished
    progress: number; // 0 to 1 (0 = start, 1 = done)
    theme?: 'day' | 'night' | 'sunset';
}

export default function Capybara({ isSleeping, isDone, progress, theme = 'day' }: CapybaraProps) {
    const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [messageTimer, setMessageTimer] = useState<NodeJS.Timeout | null>(null);

    const handlePet = (e: React.MouseEvent) => {
        e.preventDefault();

        // Add a heart
        const id = Date.now();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setHearts(prev => [...prev, { id, x, y }]);
        setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 1500);

        // Show a Message
        if (messageTimer) clearTimeout(messageTimer);

        // Pick random message
        const randomMsg = CAPY_CHATS[Math.floor(Math.random() * CAPY_CHATS.length)];
        setMessage(randomMsg);

        // Hide message after 3s
        const timer = setTimeout(() => setMessage(null), 3000);
        setMessageTimer(timer);
    };

    // Calculate sinking based on progress
    // At 0 progress: top 20px
    // At 1 progress: top 60px (drowning/sinking deeper)
    const sinkDepth = 20 + (progress * 50); // sinks 50px deeper

    return (
        <div className={styles.container} onClick={handlePet}>
            {/* Messages */}
            {message && <div className={styles.speechBubble}>{message}</div>}

            {/* Floating Hearts */}
            {hearts.map(heart => (
                <div key={heart.id} className={styles.heart}>❤️</div>
            ))}

            <div
                className={styles.capybara}
                style={{ top: `${sinkDepth}px` }} // Dynamic sinking
            >

                {/* Yuzu reward appears when done */}
                {isDone && (
                    <div className={styles.yuzu}>
                        <div className={styles.yuzuLeaf} />
                    </div>
                )}

                {/* Towel for relaxation mode (only when not "drowning" too much or just swimming) */}
                {!isDone && <div className={styles.towel} />}

                {/* Duckie Companion */}
                {!isSleeping && (
                    <div className={styles.duckie}>
                        <div className={styles.duckieHead} />
                        <div className={styles.duckieBeak} />
                    </div>
                )}

                <div className={styles.head}>
                    <div className={styles.ear} />
                    <div style={{
                        height: isSleeping ? '2px' : '8px',
                        borderRadius: isSleeping ? '0' : '50%',
                        transform: isSleeping ? 'rotate(0deg)' : 'none'
                    }}
                        className={styles.eye}
                    />
                    <div className={styles.snout} />
                    <div className={styles.nose} />
                </div>
                <div className={styles.body} />
            </div>

            <div className={styles.water} style={{ height: isDone ? '45%' : '40%' }}>
                {/* Bubbles */}
                {!isSleeping && (
                    <>
                        <div className={styles.bubble} style={{ left: '20%', width: '10px', height: '10px', animationDelay: '0s' }} />
                        <div className={styles.bubble} style={{ left: '70%', width: '8px', height: '8px', animationDelay: '1.5s' }} />
                        <div className={styles.bubble} style={{ left: '50%', width: '12px', height: '12px', animationDelay: '3s' }} />
                    </>
                )}
            </div>
        </div>
    );
}
