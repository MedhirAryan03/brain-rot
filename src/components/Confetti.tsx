"use client";

import { useEffect, useState } from 'react';

export default function Confetti() {
    const [pieces, setPieces] = useState<{ id: number; left: string; color: string; delay: number; duration: number }[]>([]);

    useEffect(() => {
        const colors = ['#FFD140', '#4FA4CC', '#FF4081', '#7FCDEA', '#FFFFFF'];
        const newPieces = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 2,
        }));
        setPieces(newPieces);

        // Auto-remove after some time to save performance
        const timer = setTimeout(() => setPieces([]), 8000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {pieces.map((p) => (
                <div
                    key={p.id}
                    className="confetti"
                    style={{
                        left: p.left,
                        backgroundColor: p.color,
                        animation: `confettiFall ${p.duration}s linear ${p.delay}s forwards`,
                    }}
                />
            ))}
        </>
    );
}
