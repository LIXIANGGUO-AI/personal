import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// DocumentView — 文档管理与预览
// ============================================

export default function DocumentView({ data }) {
  const [items, setItems] = useState(data || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  
  const currentItem = items[activeIndex];

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems = Array.from(files).map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      title: file.name.split('.')[0],
      description: 'Local document archive',
      year: new Date().getFullYear().toString(),
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setItems(prev => [...prev, ...newItems]);
    setActiveIndex(items.length); // 切换到新上传的
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this document?')) return;
    setItems(prev => {
      const updated = prev.filter((_, i) => i !== activeIndex);
      if (activeIndex >= updated.length && updated.length > 0) {
        setActiveIndex(updated.length - 1);
      }
      return updated;
    });
  };

  const handleUpdate = (field, value) => {
    setItems(prev => prev.map((item, i) => 
      i === activeIndex ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: 'rgba(10,8,6,0.3)', color: 'var(--cream)' }}>
      {/* Sidebar: List of documents */}
      <div style={{ 
        width: 220, 
        borderRight: '1px solid rgba(255,255,255,0.08)', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.5, letterSpacing: '0.1em' }}>LIBRARY</span>
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{ background: 'none', border: 'none', color: 'var(--rose-gold)', cursor: 'pointer', fontSize: 16 }}
          >+</button>
          <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,image/*" />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {items.map((item, i) => (
            <div 
              key={item.id}
              onClick={() => { setActiveIndex(i); setIsEditing(false); }}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'var(--font-display)',
                background: i === activeIndex ? 'rgba(201, 168, 130, 0.1)' : 'transparent',
                color: i === activeIndex ? 'var(--rose-gold)' : 'var(--cream)',
                borderLeft: i === activeIndex ? '2px solid var(--rose-gold)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Area: Preview & Edit */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentItem ? (
          <>
            {/* Toolbar */}
            <div style={{ 
              padding: '8px 16px', 
              borderBottom: '1px solid rgba(255,255,255,0.08)', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(10,8,6,0.2)'
            }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  style={toolBtnStyle}
                >
                  {isEditing ? '✓ Done' : '✎ Rename'}
                </button>
                <button onClick={handleDelete} style={{ ...toolBtnStyle, color: '#c87070' }}>
                  🗑 Delete
                </button>
              </div>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', opacity: 0.3 }}>
                PATH: /ARCHIVE/{currentItem.title.toUpperCase()}
              </div>
            </div>

            {/* Content View */}
            <div style={{ flex: 1, overflow: 'hidden', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
                  <label style={labelStyle}>TITLE</label>
                  <input 
                    value={currentItem.title}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    style={inputStyle}
                  />
                  <label style={labelStyle}>DESCRIPTION</label>
                  <textarea 
                    value={currentItem.description}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    style={{ ...inputStyle, height: 80, resize: 'none' }}
                  />
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: 16 }}>
                    <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--cream)', letterSpacing: '0.05em' }}>{currentItem.title}</h2>
                    <p style={{ margin: '4px 0 0', fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.4 }}>{currentItem.description} — {currentItem.year}</p>
                  </div>
                  <div style={{ flex: 1, background: '#fff', borderRadius: 4, overflow: 'hidden' }}>
                    {currentItem.url ? (
                      <iframe 
                        src={currentItem.url} 
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={currentItem.title}
                      />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b7355' }}>
                        PREVIEW NOT AVAILABLE
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
            SELECT A DOCUMENT OR UPLOAD
          </div>
        )}
      </div>
    </div>
  );
}

const toolBtnStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 4,
  color: 'var(--cream)',
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  padding: '4px 10px',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const labelStyle = {
  fontSize: 9,
  fontFamily: 'var(--font-mono)',
  opacity: 0.4,
  letterSpacing: '0.1em'
};

const inputStyle = {
  background: 'rgba(0,0,0,0.2)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 4,
  color: 'var(--cream)',
  fontFamily: 'var(--font-display)',
  fontSize: 14,
  padding: '8px 12px',
  outline: 'none'
};
