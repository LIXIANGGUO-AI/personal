import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { useWritings } from '../hooks/useWritings';

// ============================================
// TextReader — 文字作品展示 + 编辑
// 数据来自 useWritings（localStorage 持久化）
// ============================================

// 防抖：500ms 后保存
function useDebounce(fn, delay = 500) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

// ---- 编辑工具栏 ----
function Toolbar({ isEditing, onToggle, onDelete, onAdd }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(10,8,6,0.2)',
      flexShrink: 0,
    }}>
      {/* 新建按钮 */}
      <button
        onClick={onAdd}
        title="新建文章"
        style={btnStyle('#c9a882', false)}
      >
        ＋ New
      </button>

      <div style={{ flex: 1 }} />

      {/* 删除（仅编辑模式） */}
      <AnimatePresence>
        {isEditing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onDelete}
            title="删除当前文章"
            style={btnStyle('#c87070', false)}
          >
            🗑 Delete
          </motion.button>
        )}
      </AnimatePresence>

      {/* 编辑/完成 */}
      <button
        onClick={onToggle}
        style={btnStyle('#7aaa88', isEditing)}
      >
        {isEditing ? '✓ Done' : '✎ Edit'}
      </button>
    </div>
  );
}

function btnStyle(color, active) {
  return {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.1em',
    color: active ? '#1a1410' : color,
    background: active ? color : `${color}22`,
    border: `1px solid ${color}55`,
    borderRadius: 4,
    padding: '4px 10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    lineHeight: 1.6,
  };
}

// ---- 侧边栏 ----
function Sidebar({ writings, selected, onSelect, onAdd }) {
  return (
    <div style={{
      width: 150,
      borderRight: '1px solid rgba(255,255,255,0.1)',
      overflowY: 'auto',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        {writings.map((piece, i) => (
          <div
            key={piece.id}
            onClick={() => onSelect(i)}
            style={{
              padding: '10px 14px',
              cursor: 'pointer',
              borderLeft: i === selected
                ? '2px solid var(--rose-gold)'
                : '2px solid transparent',
              background: i === selected
                ? 'rgba(201, 168, 130, 0.08)'
                : 'transparent',
              transition: 'all 0.18s',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 12,
              color: i === selected ? 'var(--cream)' : 'rgba(245,240,232,0.5)',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {piece.title || '无题'}
            </div>
            {piece.year && (
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--warm-brown)',
                marginTop: 3,
              }}>
                {piece.year}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 底部新建快捷按钮 */}
      <button
        onClick={onAdd}
        style={{
          margin: '8px 10px',
          padding: '7px 0',
          background: 'rgba(201,168,130,0.07)',
          border: '1px dashed rgba(201,168,130,0.3)',
          borderRadius: 4,
          color: 'rgba(201,168,130,0.6)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          cursor: 'pointer',
          transition: 'all 0.2s',
          letterSpacing: '0.05em',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(201,168,130,0.13)';
          e.currentTarget.style.color = 'rgba(201,168,130,0.9)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(201,168,130,0.07)';
          e.currentTarget.style.color = 'rgba(201,168,130,0.6)';
        }}
      >
        ＋
      </button>
    </div>
  );
}

// ---- 阅读视图 ----
function ReadView({ item }) {
  return (
    <motion.div
      key={item.id + '_read'}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="scrollable"
      style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 22,
          fontWeight: 400,
          color: 'var(--cream)',
          lineHeight: 1.3,
          marginBottom: 8,
        }}>
          {item.title}
        </h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {item.year && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--warm-brown)',
              letterSpacing: '0.1em',
            }}>
              {item.year}
            </span>
          )}
          {item.description && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              fontSize: 12,
              color: 'rgba(245,240,232,0.5)',
            }}>
              {item.description}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        lineHeight: 1.85,
        color: 'rgba(245, 240, 232, 0.88)',
        maxWidth: 520,
        userSelect: 'text',
      }}>
        {item.content?.split('\n\n').map((para, i) => (
          <p key={i} style={{ marginBottom: '1.4em', textIndent: i > 0 ? '1.5em' : 0 }}>
            {i === 0 && para.length > 0 ? (
              <>
                <span style={{
                  float: 'left',
                  fontFamily: 'var(--font-display)',
                  fontSize: '3.8em',
                  lineHeight: 0.78,
                  marginRight: '0.08em',
                  marginTop: '0.06em',
                  color: 'var(--rose-gold)',
                  fontStyle: 'italic',
                }}>
                  {para[0]}
                </span>
                {para.slice(1)}
              </>
            ) : para}
          </p>
        ))}
        {(!item.content || item.content.trim() === '') && (
          <p style={{ color: 'rgba(245,240,232,0.25)', fontStyle: 'italic' }}>
            空白页，点击 ✎ Edit 开始书写…
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ---- 编辑视图 ----
function EditView({ item, onSave }) {
  const debouncedSave = useDebounce(onSave, 500);

  const handleChange = (field, value) => {
    debouncedSave(item.id, { [field]: value });
  };

  return (
    <motion.div
      key={item.id + '_edit'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="scrollable"
      style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      {/* 标题输入 */}
      <input
        defaultValue={item.title}
        onChange={e => handleChange('title', e.target.value)}
        placeholder="标题…"
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 22,
          fontWeight: 400,
          color: 'var(--cream)',
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(201,168,130,0.3)',
          outline: 'none',
          width: '100%',
          paddingBottom: 8,
        }}
      />

      {/* 年份 + 副标题 */}
      <div style={{ display: 'flex', gap: 12 }}>
        <input
          type="number"
          defaultValue={item.year}
          onChange={e => handleChange('year', parseInt(e.target.value) || '')}
          placeholder="年份"
          style={{
            ...metaInputStyle,
            width: 72,
          }}
        />
        <input
          defaultValue={item.description}
          onChange={e => handleChange('description', e.target.value)}
          placeholder="副标题 / 简介…"
          style={{ ...metaInputStyle, flex: 1 }}
        />
      </div>

      {/* 正文 */}
      <textarea
        key={item.id}
        defaultValue={item.content}
        onChange={e => {
          handleChange('content', e.target.value);
          // 自动撑高
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }}
        placeholder="在此开始书写…&#10;&#10;段落之间空一行。"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          lineHeight: 1.85,
          color: 'rgba(245,240,232,0.88)',
          background: 'rgba(245,240,232,0.03)',
          border: '1px solid rgba(201,168,130,0.18)',
          borderRadius: 6,
          outline: 'none',
          resize: 'none',
          width: '100%',
          minHeight: 280,
          padding: '16px 18px',
          boxSizing: 'border-box',
          overflowY: 'hidden',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(201,168,130,0.45)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(201,168,130,0.18)'; }}
      />

      {/* 保存提示 */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'rgba(245,240,232,0.25)',
        letterSpacing: '0.08em',
        textAlign: 'right',
      }}>
        自动保存 · AUTO SAVE
      </div>
    </motion.div>
  );
}

const metaInputStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--warm-brown)',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(201,168,130,0.2)',
  outline: 'none',
  padding: '2px 0',
  letterSpacing: '0.08em',
};

// ---- 主组件 ----
export default function TextReader() {
  const { writings, saveWriting, addWriting, deleteWriting } = useWritings();
  const [selected, setSelected] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  if (!writings || writings.length === 0) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', fontFamily: 'var(--font-body)', fontStyle: 'italic',
      fontSize: 14, color: 'rgba(245,240,232,0.4)', flexDirection: 'column', gap: 16,
    }}>
      <span>暂无文字</span>
      <button
        onClick={() => { addWriting(); setSelected(0); setIsEditing(true); }}
        style={btnStyle('#c9a882', false)}
      >
        ＋ 新建第一篇
      </button>
    </div>
  );

  const safeIdx = Math.min(selected, writings.length - 1);
  const item = writings[safeIdx];

  const handleAdd = () => {
    addWriting();
    setSelected(0);
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (writings.length <= 1) {
      deleteWriting(item.id);
      return;
    }
    const nextIdx = safeIdx > 0 ? safeIdx - 1 : 0;
    deleteWriting(item.id);
    setSelected(nextIdx);
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      {/* 工具栏 */}
      <Toolbar
        isEditing={isEditing}
        onToggle={() => setIsEditing(v => !v)}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {/* 主体 */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 侧边栏（多篇时显示） */}
        {writings.length > 1 && (
          <Sidebar
            writings={writings}
            selected={safeIdx}
            onSelect={i => { setSelected(i); setIsEditing(false); }}
            onAdd={handleAdd}
          />
        )}

        {/* 内容区 */}
        <AnimatePresence mode="wait">
          {isEditing
            ? <EditView key={item.id + '_e'} item={item} onSave={saveWriting} />
            : <ReadView key={item.id + '_r'} item={item} />
          }
        </AnimatePresence>
      </div>
    </div>
  );
}
