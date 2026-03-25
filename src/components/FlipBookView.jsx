import { useRef } from 'react';
import { motion } from 'framer-motion';
// NOTE: react-pageflip 需要 npm install react-pageflip
// 如遇导入问题，确保已安装依赖
import HTMLFlipBook from 'react-pageflip';

// ============================================
// FlipBookView — 翻书式文档预览
// ============================================

function Page({ src, number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#F5F0E8',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {src ? (
        <img
          src={src}
          alt={`Page ${number}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'sepia(0.15) saturate(0.85)',
          }}
        />
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#8B7355',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
        }}>
          Page {number}
        </div>
      )}

      {/* Page number */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'rgba(139, 115, 85, 0.7)',
        letterSpacing: '0.1em',
      }}>
        — {number} —
      </div>
    </div>
  );
}

export default function FlipBookView({ data }) {
  const book = useRef(null);

  if (!data || data.length === 0) return null;

  const item = data[0]; // 取第一个文档展示
  const pages = item.pages || [];

  // 补充封面和空白页（翻书要求偶数页）
  const allPages = [null, ...pages];
  if (allPages.length % 2 !== 0) allPages.push(null);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 16,
        background: 'transparent',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HTMLFlipBook
          ref={book}
          width={220}
          height={300}
          size="fixed"
          minWidth={160}
          maxWidth={280}
          minHeight={220}
          maxHeight={400}
          showCover={true}
          mobileScrollSupport={true}
          flippingTime={600}
          style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
          className="flipbook"
        >
          {allPages.map((src, i) => (
            <Page key={i} src={src} number={i + 1} />
          ))}
        </HTMLFlipBook>
      </motion.div>

      {/* Navigation controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={() => book.current?.pageFlip().flipPrev()}
          style={btnStyle}
        >
          ‹ Prev
        </button>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--warm-brown)',
          letterSpacing: '0.1em',
        }}>
          {item.title}
        </div>
        <button
          onClick={() => book.current?.pageFlip().flipNext()}
          style={btnStyle}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  background: 'rgba(245, 240, 232, 0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 3,
  color: 'var(--cream)',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.08em',
  padding: '5px 12px',
  cursor: 'pointer',
  transition: 'background 0.2s',
};
