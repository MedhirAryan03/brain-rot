"use client";

import { useEffect, useState } from 'react';

export default function BackgroundParticles() {
    const [particles, setParticles] = useState<{ id: number; left: string; delay: number; duration: number; size: number }[]>([]);

    useEffect(() => {
        // Generate floating particles (leaves, bubbles, etc.)
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: Math.random() * 10,
            duration: 15 + Math.random() * 10,
            size: 20 + Math.random() * 30,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        bottom: '-50px',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animation: `particleFloat ${p.duration}s linear ${p.delay}s infinite`,
                        background: Math.random() > 0.5
                            ? 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(127,205,234,0.4) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }}
                />
            ))}
        </>
    );
}
