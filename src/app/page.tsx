"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Capybara from '@/components/Capybara';
import Timer from '@/components/Timer';
import BackgroundParticles from '@/components/BackgroundParticles';
import Confetti from '@/components/Confetti';
import { StatsPanel, AchievementToast, SoundToggle } from '@/components/Features';

export default function Home() {
  const [timerState, setTimerState] = useState<'idle' | 'running' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<'day' | 'night' | 'sunset'>('day');
  const [isMuted, setIsMuted] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    sessionsCompleted: 0,
    totalMinutes: 0,
    streak: 0,
  });

  // Achievement state
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('capy-stats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const handleStateChange = (state: 'idle' | 'running' | 'done', prog: number) => {
    setTimerState(state);
    setProgress(prog);

    if (state === 'done' && timerState !== 'done') {
      // Update stats
      const newStats = {
        ...stats,
        sessionsCompleted: stats.sessionsCompleted + 1,
        totalMinutes: stats.totalMinutes + 1, // Simplified per session for now
      };

      setStats(newStats);
      localStorage.setItem('capy-stats', JSON.stringify(newStats));

      // Trigger achievement
      if (newStats.sessionsCompleted === 1) {
        setCurrentAchievement({
          id: 'first_dip',
          title: 'First Dip',
          description: 'You completed your first relaxation session!',
          icon: '🛀'
        });
      } else if (newStats.sessionsCompleted === 5) {
        setCurrentAchievement({
          id: 'relax_pro',
          title: 'Relaxation Pro',
          description: '5 sessions completed! You are getting the hang of this.',
          icon: '🧘'
        });
      }
    }
  };

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
      <BackgroundParticles />
      {timerState === 'done' && <Confetti />}

      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100, display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setTheme('day')} className={styles.themeBtn} aria-label="Day Mode">☀️</button>
        <button onClick={() => setTheme('sunset')} className={styles.themeBtn} aria-label="Sunset Mode">🌅</button>
        <button onClick={() => setTheme('night')} className={styles.themeBtn} aria-label="Night Mode">🌙</button>
      </div>

      <h1 className={styles.title}>CapyTimer</h1>

      <div className={styles.content}>
        <div className={styles.capyWrapper}>
          {/* Progress Ring */}
          <svg className={styles.progressRing} width="320" height="320">
            <circle
              className={styles.progressRingCircle}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="transparent"
              r="150"
              cx="160"
              cy="160"
            />
            <circle
              className={styles.progressRingCircle}
              stroke="var(--color-yuzu)"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 150}`}
              strokeDashoffset={`${2 * Math.PI * 150 * (1 - progress)}`}
              strokeLinecap="round"
              fill="transparent"
              r="150"
              cx="160"
              cy="160"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          <Capybara
            isSleeping={timerState === 'idle'}
            isDone={timerState === 'done'}
            progress={progress}
            theme={theme}
          />
        </div>

        <p className={styles.chatHint}>
          ✨ Click me to chat! ✨
        </p>

        <Timer onStateChange={handleStateChange} />
      </div>

      <StatsPanel {...stats} />

      <SoundToggle isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />

      <AchievementToast
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />
    </main>
  );
}
