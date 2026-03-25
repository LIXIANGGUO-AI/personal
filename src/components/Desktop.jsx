import { motion } from 'framer-motion';
import { useState } from 'react';
import { CATEGORIES } from '../constants/categories';

// ============================================
// Desktop — 桌面图标层
// ============================================

// 原尺寸 × 1.2
// icon容器: 52 → 62, 文字宽度: 80 → 96

export default function Desktop({ openWindows, onOpen }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    }}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', marginBottom: 64 }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 400,
          color: 'var(--cream)',
          letterSpacing: '0.04em',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          lineHeight: 1.2,
        }}>
          The Archive
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--warm-brown)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginTop: 10,
        }}>
          A Digital Museum
        </div>
      </motion.div>

      {/* Icons row */}
      <div style={{
        display: 'flex',
        gap: 'clamp(24px, 5vw, 64px)',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '0 24px',
      }}>
        {CATEGORIES.map((cat, i) => (
          <DesktopIcon
            key={cat.id}
            category={cat}
            index={i}
            isOpen={openWindows.includes(cat.id)}
            onClick={() => onOpen(cat)}
          />
        ))}
      </div>

      {/* Subtle date stamp */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'rgba(139, 115, 85, 0.5)',
          letterSpacing: '0.15em',
          whiteSpace: 'nowrap',
        }}
      >
        {new Date().getFullYear()} — All works reserved
      </motion.div>
    </div>
  );
}

function DesktopIcon({ category, index, isOpen, onClick }) {
  const [hovered, setHovered] = useState(false);

  // 悬停色：白色 → 暖米色
  const iconColor = isOpen
    ? 'var(--rose-gold)'
    : hovered
      ? 'rgba(245, 235, 210, 1)'     // 米色
      : 'rgba(245, 240, 232, 0.8)';  // 原白色

  const labelColor = isOpen
    ? 'var(--rose-gold)'
    : hovered
      ? 'rgba(245, 235, 210, 1)'
      : 'rgba(245, 240, 232, 0.85)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.6 + index * 0.1,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        padding: 14,
        borderRadius: 10,
        userSelect: 'none',
        width: 96,                     // 80 × 1.2
        // 按下感：hover 时极快缩到 98% 再弹回
        transform: hovered ? 'scale(0.98)' : 'scale(1)',
        transition: hovered
          ? 'transform 0.15s ease, background 0.2s'
          : 'transform 0.25s ease, background 0.2s',
        background: 'transparent',
      }}
    >
      {/* Icon container — 52 × 1.2 = 62 */}
      <div style={{
        width: 62,
        height: 62,
        color: iconColor,
        filter: isOpen
          ? 'drop-shadow(0 0 8px rgba(201, 168, 130, 0.5))'
          : hovered
            ? 'drop-shadow(0 2px 12px rgba(245,235,210,0.3))'
            : 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
        transition: 'color 0.2s, filter 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
        dangerouslySetInnerHTML={{ __html: category.icon }}
      />

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 14,                // 12 × 1.2 ≈ 14
          color: labelColor,
          letterSpacing: '0.05em',
          lineHeight: 1.3,
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          transition: 'color 0.2s',
        }}>
          {category.label}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,                // 9 × 1.2 ≈ 10
          color: hovered
            ? 'rgba(180, 155, 110, 0.9)'
            : 'rgba(139, 115, 85, 0.7)',
          letterSpacing: '0.08em',
          marginTop: 3,
          fontWeight: hovered ? 600 : 400,   // 中文加粗
          transition: 'color 0.2s, font-weight 0.15s',
        }}>
          {category.labelCn}
        </div>
      </div>

      {/* Open indicator dot */}
      {isOpen && (
        <div style={{
          width: 4, height: 4,
          borderRadius: '50%',
          background: 'var(--rose-gold)',
          marginTop: -6,
          boxShadow: '0 0 6px var(--rose-gold)',
        }} />
      )}
    </motion.div>
  );
}
