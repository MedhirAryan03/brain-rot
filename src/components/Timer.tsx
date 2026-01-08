"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './Timer.module.css';

interface TimerProps {
    onStateChange: (state: 'idle' | 'running' | 'done', progress: number) => void;
}

type Category = 'food' | 'focus' | 'rest';

interface Preset {
    label: string;
    minutes: number;
    category: Category;
}

const PRESETS: Preset[] = [
    { label: 'Runny Egg (6m)', minutes: 6, category: 'food' },
    { label: 'Jammy Egg (7m)', minutes: 7, category: 'food' },
    { label: 'Hard Egg (10m)', minutes: 10, category: 'food' },
    { label: 'Ramen (3m)', minutes: 3, category: 'food' },
    { label: 'Green Tea (2m)', minutes: 2, category: 'food' },
    { label: 'Pomodoro (25m)', minutes: 25, category: 'focus' },
    { label: 'Short Break (5m)', minutes: 5, category: 'focus' },
    { label: 'Long Break (15m)', minutes: 15, category: 'focus' },
    { label: 'Power Nap (20m)', minutes: 20, category: 'rest' },
    { label: 'Deep Breath (1m)', minutes: 1, category: 'rest' },
];

export default function Timer({ onStateChange }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [initialTime, setInitialTime] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Sound Alarm
    const playAlarm = () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);

            // Repeat beep 3 times
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(440, ctx.currentTime);
                gain2.gain.setValueAtTime(0.5, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc2.start();
                osc2.stop(ctx.currentTime + 0.5);
            }, 600);

            setTimeout(() => {
                const osc3 = ctx.createOscillator();
                const gain3 = ctx.createGain();
                osc3.connect(gain3);
                gain3.connect(ctx.destination);
                osc3.type = 'sine';
                osc3.frequency.setValueAtTime(880, ctx.currentTime);
                gain3.gain.setValueAtTime(0.5, ctx.currentTime);
                gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc3.start();
                osc3.stop(ctx.currentTime + 0.5);
            }, 1200);

        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const calculateProgress = (current: number, total: number) => {
        if (total === 0) return 0;
        return 1 - (current / total);
    };

    const handleTick = () => {
        setTimeLeft((prev) => {
            const newVal = prev - 1;
            const progress = calculateProgress(newVal, initialTime);

            if (newVal <= 0) {
                setIsRunning(false);
                onStateChange('done', 1);
                playAlarm();
                return 0;
            }

            onStateChange('running', progress);
            return newVal;
        });
    };

    const startTimer = () => {
        if (timeLeft <= 0) {
            resetTimer();
            return;
        }
        // Resume audio context if needed (browsers block auto-play)
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
        setIsRunning(true);
        // Explicitly update state immediately
        onStateChange('running', calculateProgress(timeLeft, initialTime));
    };

    const pauseTimer = () => {
        setIsRunning(false);
        onStateChange('idle', calculateProgress(timeLeft, initialTime));
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(initialTime);
        onStateChange('idle', 0);
    };

    const setPreset = (minutes: number) => {
        const seconds = minutes * 60;
        setInitialTime(seconds);
        setTimeLeft(seconds);
        setIsRunning(false);
        onStateChange('idle', 0);
    };

    const adjustTime = (seconds: number) => {
        const newTime = Math.max(0, timeLeft + seconds);
        setTimeLeft(newTime);
        if (!isRunning) {
            setInitialTime(newTime);
        }
        // Update progress visually immediately
        const total = isRunning ? initialTime : newTime;
        onStateChange(isRunning ? 'running' : 'idle', calculateProgress(newTime, total));
    };

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(handleTick, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, timeLeft]);

    const renderCategory = (cat: Category, title: string) => (
        <div style={{ width: '100%', marginBottom: '1rem' }}>
            <div className={styles.categoryLabel}>{title}</div>
            <div className={styles.presets}>
                {PRESETS.filter(p => p.category === cat).map((preset) => (
                    <button
                        key={preset.label}
                        className={`${styles.presetChip} ${initialTime === preset.minutes * 60 ? styles.active : ''}`}
                        onClick={() => setPreset(preset.minutes)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className={styles.timerContainer}>
            <div className={styles.adjustControls}>
                <button className={styles.adjustButton} onClick={() => adjustTime(-60)} aria-label="-1 min">-1m</button>
                <div className={styles.timeDisplay}>
                    {formatTime(timeLeft)}
                </div>
                <button className={styles.adjustButton} onClick={() => adjustTime(60)} aria-label="+1 min">+1m</button>
            </div>

            <div className={styles.controls}>
                <button className={styles.button} onClick={resetTimer} aria-label="Reset">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
                </button>

                <button
                    className={`${styles.button} ${styles.primaryButton}`}
                    onClick={isRunning ? pauseTimer : startTimer}
                >
                    {isRunning ? (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                    ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    )}
                </button>
            </div>

            <div style={{ width: '100%', marginTop: '1rem' }}>
                {renderCategory('food', 'Kitchen')}
                {renderCategory('focus', 'Productivity')}
                {renderCategory('rest', 'Wellness')}
            </div>
        </div>
    );
}
