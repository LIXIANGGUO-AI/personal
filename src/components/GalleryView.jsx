import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// GalleryView — 恢复稳定版本：窗口化核心展示
// ============================================

export default function GalleryView({ data }) {
  const [items, setItems] = useState(data || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((files) => {
    const newItems = Array.from(files).map((file, index) => ({
      id: `local-${Date.now()}-${index}`,
      title: file.name.split('.')[0].toUpperCase(),
      description: 'Newly uploaded archive',
      year: new Date().getFullYear().toString(),
      cover: URL.createObjectURL(file),
    }));
    setItems(prev => [...newItems, ...prev]);
    setActiveIndex(0);
  }, []);

  const navigate = (newDirection) => {
    setDirection(newDirection);
    setActiveIndex(prev => {
      let next = prev + newDirection;
      if (next < 0) next = items.length - 1;
      if (next >= items.length) next = 0;
      return next;
    });
  };

  const currentItem = items[activeIndex];

  if (!items.length) {
    return (
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.target.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 8, margin: 16, cursor: 'pointer',
          background: isDragging ? 'rgba(255,255,255,0.03)' : 'transparent',
        }}
      >
        <input type="file" hidden multiple ref={fileInputRef} onChange={(e) => handleFile(e.target.files)} accept="image/*" />
        <div style={{ color: 'var(--cream)', opacity: 0.4, fontSize: 13, fontFamily: 'var(--font-mono)' }}>
          DRAG OR CLICK TO UPLOAD
        </div>
      </div>
    );
  }

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <input type="file" hidden multiple ref={fileInputRef} onChange={(e) => handleFile(e.target.files)} accept="image/*" />

      {/* Hero Display Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px 0', minHeight: 0, position: 'relative' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img 
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              src={currentItem.cover} 
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ 
                maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', 
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)', borderRadius: 2
              }}
            />
          </AnimatePresence>

          {/* Nav Arrows */}
          <div style={{ position: 'absolute', inset: '0 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
            <button onClick={() => navigate(-1)} style={{ pointerEvents: 'auto', background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer', opacity: 0.3 }}>‹</button>
            <button onClick={() => navigate(1)} style={{ pointerEvents: 'auto', background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer', opacity: 0.3 }}>›</button>
          </div>
        </div>

        {/* Metadata */}
        <div style={{ padding: '12px 0 16px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', color: 'var(--cream)', textTransform: 'uppercase' }}>
            {currentItem.title}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(245, 240, 232, 0.3)', marginTop: 2 }}>
            {currentItem.description} — {currentItem.year}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div style={{ height: 90, padding: '0 20px 20px', display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            onClick={() => { setDirection(index > activeIndex ? 1 : -1); setActiveIndex(index); }}
            whileHover={{ scale: 1.05 }}
            style={{
              flexShrink: 0, width: 60, height: 70, cursor: 'pointer', borderRadius: 2, overflow: 'hidden',
              border: index === activeIndex ? '1.5px solid var(--rose-gold)' : '1.5px solid transparent',
              opacity: index === activeIndex ? 1 : 0.4, transition: 'all 0.3s'
            }}
          >
            <img src={item.cover} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        ))}
        <div 
          onClick={() => fileInputRef.current?.click()} 
          style={{ 
            flexShrink: 0, width: 60, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', 
            border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 2, cursor: 'pointer', color: 'rgba(255,255,255,0.2)' 
          }}
        >+</div>
      </div>
    </div>
  );
}
