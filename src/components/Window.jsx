import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { useNotion } from '../hooks/useNotion';
import GalleryView from './GalleryView';
import FlipBookView from './FlipBookView';
import TextReader from './TextReader';
import TimelineView from './TimelineView';

// ============================================
// Window — 可拖拽半透明窗口
// ============================================

const TITLEBAR_H = 32;

// Loading animation — 复古打字机风格
function LoadingState({ category }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 16,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--warm-brown)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        Loading {category}
        <span className="cursor-blink">_</span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--warm-brown)',
            animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

function WindowContent({ category, type }) {
  // Timeline 不依赖单一 category，独立渲染
  if (type === 'timeline') return <TimelineView />;

  const { data, loading, error } = useNotion(category);

  if (loading) return <LoadingState category={category} />;
  if (error) return (
    <div style={{
      padding: 24,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'rgba(201, 168, 130, 0.7)',
    }}>
      Failed to load: {error}
    </div>
  );
  if (!data || data.length === 0) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontFamily: 'var(--font-body)',
      fontStyle: 'italic',
      fontSize: 14,
      color: 'rgba(245,240,232,0.4)',
    }}>
      Nothing here yet.
    </div>
  );

  if (type === 'gallery') return <GalleryView data={data} />;
  if (type === 'flipbook') return <FlipBookView data={data} />;
  if (type === 'text')    return <TextReader />;
  return <GalleryView data={data} />;
}

// Traffic light buttons
function TrafficLights({ onClose, onMinimize, onMaximize }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        title="Close"
        style={{ ...dotStyle, background: '#FF5F57' }}
      />
      <button
        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
        title="Minimize"
        style={{ ...dotStyle, background: '#FFBD2E' }}
      />
      <button
        onClick={(e) => { e.stopPropagation(); onMaximize(); }}
        title="Maximize"
        style={{ ...dotStyle, background: '#28C840' }}
      />
    </div>
  );
}

const dotStyle = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  border: '1.5px solid rgba(0,0,0,0.1)',
  cursor: 'pointer',
  padding: 0,
  outline: 'none',
  transition: 'filter 0.1s',
};

export default function Window({
  id, category, label, type,
  initialX, initialY, zIndex,
  onClose, onFocus,
}) {
  const isMobile = window.innerWidth < 768;
  const [isMaximized, setIsMaximized] = useState(false);
  const [rect, setRect] = useState({
    x: initialX,
    y: initialY,
    width: 640,
    height: 480
  });
  const prevRectRef = useRef(rect);

  const toggleMaximize = useCallback(() => {
    if (!isMaximized) {
      prevRectRef.current = rect;
      // Maximize
      setRect({
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight
      });
    } else {
      // Restore
      setRect(prevRectRef.current);
    }
    setIsMaximized(!isMaximized);
  }, [isMaximized, rect]);

  // Mobile: full-screen drawer from bottom
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '85vh',
            zIndex,
            background: 'rgba(26, 20, 16, 0.92)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px 12px 0 0',
            border: '1px solid var(--border-glass)',
            borderBottom: 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Mobile titlebar */}
          <div style={{
            height: TITLEBAR_H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 13,
              letterSpacing: '0.1em',
              color: 'var(--cream)',
            }}>
              {label}
            </span>
            <button onClick={onClose} style={{
              background: 'none', border: 'none',
              color: 'var(--cream)', fontSize: 20, cursor: 'pointer',
              padding: 0, opacity: 0.7,
            }}>
              ×
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <WindowContent category={category} type={type} />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop: draggable floating window
  return (
    <Rnd
      size={{ width: rect.width, height: rect.height }}
      position={{ x: rect.x, y: rect.y }}
      onDragStop={(e, d) => {
        if (!isMaximized) setRect(prev => ({ ...prev, x: d.x, y: d.y }));
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized) {
          setRect({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            ...position,
          });
        }
      }}
      minWidth={320}
      minHeight={260}
      bounds="window"
      dragHandleClassName="titlebar-drag"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      onMouseDown={onFocus}
      style={{ zIndex, transition: isMaximized ? 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' : 'none' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.94, filter: 'blur(4px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: isMaximized ? 0 : 'var(--window-radius)',
          background: 'rgba(26, 20, 16, 0.55)',
          backdropFilter: 'blur(24px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
          border: isMaximized ? 'none' : '1px solid var(--border-glass)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        <div
          className="titlebar-drag"
          style={{
            height: TITLEBAR_H,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            background: 'rgba(10, 8, 6, 0.3)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            flexShrink: 0,
            cursor: isMaximized ? 'default' : 'grab',
            userSelect: 'none',
          }}
          onMouseDown={e => { if (!isMaximized) e.currentTarget.style.cursor = 'grabbing'; }}
          onMouseUp={e => { if (!isMaximized) e.currentTarget.style.cursor = 'grab'; }}
        >
          <TrafficLights 
            onClose={onClose} 
            onMinimize={onClose} // For now, minimize = close
            onMaximize={toggleMaximize}
          />
          <div style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 12,
            letterSpacing: '0.12em',
            color: 'rgba(245, 240, 232, 0.75)',
            pointerEvents: 'none',
          }}>
            {label}
          </div>
          <div style={{ width: 47 }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <WindowContent category={category} type={type} />
        </div>
      </motion.div>
    </Rnd>
  );
}
