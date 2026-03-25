import { motion } from 'framer-motion';
import { CATEGORIES } from '../constants/categories';

export default function Dock({ openWindows, onOpen }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      gap: 12,
      background: 'rgba(10, 8, 6, 0.45)',
      backdropFilter: 'blur(24px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
    }}>
      {CATEGORIES.map((cat) => {
        const isOpen = openWindows.includes(cat.id);
        
        return (
          <div key={cat.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.button
              onClick={() => onOpen(cat)}
              whileHover={{ scale: 1.2, y: -8 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 44,
                height: 44,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'var(--cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
                opacity: isOpen ? 1 : 0.7,
                transition: 'opacity 0.3s ease',
              }}
              title={cat.label}
            >
              <div 
                style={{ width: 24, height: 24 }} 
                dangerouslySetInnerHTML={{ __html: cat.icon }} 
              />
            </motion.button>

            {/* Indicator Dot */}
            {isOpen && (
              <motion.div
                layoutId={`dot-${cat.id}`}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: 'var(--rose-gold)',
                  position: 'absolute',
                  bottom: -2,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
