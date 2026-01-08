"use client";

import { useState } from 'react';
import styles from './page.module.css';
import Capybara from '@/components/Capybara';
import Timer from '@/components/Timer';

export default function Home() {
  const [timerState, setTimerState] = useState<'idle' | 'running' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<'day' | 'night' | 'sunset'>('day');

  const handleStateChange = (state: 'idle' | 'running' | 'done', prog: number) => {
    setTimerState(state);
    setProgress(prog);
  };

  // Background gradients based on theme
  const getBackground = () => {
    switch (theme) {
      case 'night': return 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)';
      case 'sunset': return 'linear-gradient(135deg, #3E2b56, #8E44AD, #F39C12)';
      case 'day':
      default: return 'linear-gradient(135deg, #1A2980, #26D0CE)';
    }
  };

  return (
    <main className={styles.main} style={{ background: getBackground() }}>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100, display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setTheme('day')} style={{ fontSize: '1.2rem', padding: '0.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', cursor: 'pointer', border: 'none' }}>☀️</button>
        <button onClick={() => setTheme('sunset')} style={{ fontSize: '1.2rem', padding: '0.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', cursor: 'pointer', border: 'none' }}>🌅</button>
        <button onClick={() => setTheme('night')} style={{ fontSize: '1.2rem', padding: '0.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', cursor: 'pointer', border: 'none' }}>🌙</button>
      </div>

      <h1 className={styles.title}>CapyTimer</h1>

      <div className={styles.content}>
        <Capybara
          isSleeping={timerState === 'idle'}
          isDone={timerState === 'done'}
          progress={progress}
          theme={theme}
        />

        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.9rem',
          marginTop: '-1rem',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          ✨ Click me to chat! ✨
        </p>

        <Timer onStateChange={handleStateChange} />
      </div>
    </main>
  );
}
