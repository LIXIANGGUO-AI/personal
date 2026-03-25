import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MUSIC_TRACKS } from '../constants/categories';

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef(null);

  const currentTrack = MUSIC_TRACKS[currentIndex];

  useEffect(() => {
    // 预加载第一个音频
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.volume = volume;
    audioRef.current.loop = true;

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // 切换曲目
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.pause();
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (wasPlaying || playing) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex]);

  // 音量同步
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
  };

  const adjustVolume = (delta) => {
    setVolume((prev) => Math.min(1, Math.max(0, prev + delta)));
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9000,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        borderRadius: 32,
        background: 'rgba(10, 8, 6, 0.55)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        color: 'var(--cream)',
        minWidth: 420,
      }}
    >
      {/* Controls: Prev / Play / Next */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={prevTrack} style={btnStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
          </svg>
        </button>

        <button
          onClick={toggle}
          style={{
            ...btnStyle,
            width: 42,
            height: 42,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
          }}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <button onClick={nextTrack} style={btnStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6zM16 6v12h2V6z"/>
          </svg>
        </button>
      </div>

      {/* Info Area */}
      <div style={{ marginLeft: 28, flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 2
        }}>
          {currentTrack.title}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          opacity: 0.5,
          letterSpacing: '0.05em'
        }}>
          Track {currentIndex + 1}/{MUSIC_TRACKS.length}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        width: 1,
        height: 24,
        background: 'rgba(255,255,255,0.12)',
        margin: '0 20px'
      }} />

      {/* Volume Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => adjustVolume(-0.1)} style={volBtnStyle}>—</button>

        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>

        <button onClick={() => adjustVolume(0.1)} style={volBtnStyle}>+</button>
      </div>
    </div>
  );
}

const btnStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.85,
  transition: 'opacity 0.2s ease',
  outline: 'none',
};

const volBtnStyle = {
  ...btnStyle,
  fontSize: 14,
  width: 20,
  height: 20,
};
