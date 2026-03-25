import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Desktop from './components/Desktop';
import Window from './components/Window';
import MusicPlayer from './components/MusicPlayer';
import Dock from './components/Dock';
import { BACKGROUNDS } from './constants/categories';

// ============================================
// App — 根组件，管理窗口状态 + 背景切换
// ============================================

let zCounter = 100;

// 预加载图片，返回 Promise
function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = resolve;
    img.onerror = resolve; // 出错也继续，不卡住
    img.src = url;
  });
}

export default function App() {
  const [windows, setWindows] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);

  // ---- 双层背景：合并为单一状态对象，保证原子更新 ----
  const [layers, setLayers] = useState({
    A: BACKGROUNDS[0],
    B: BACKGROUNDS[0],
    active: 'A',   // 'A' | 'B'
  });

  // 防止按 G 时上一次过渡还没完成就再次触发
  const switching = useRef(false);

  // ---- 按 G 键切换背景 ----
  useEffect(() => {
    const handleKey = async (e) => {
      // 屏蔽输入框焦点
      const tag = document.activeElement?.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        document.activeElement?.isContentEditable
      ) return;
      if (e.key.toLowerCase() !== 'g') return;
      if (switching.current) return;

      switching.current = true;

      setBgIndex(prev => {
        const next = (prev + 1) % BACKGROUNDS.length;
        const nextBg = BACKGROUNDS[next];

        // 图片类型：先预加载，完成后再更新状态
        const doSwitch = (bg) => {
          setLayers(cur => {
            // 把新图写入非活动层，同时翻转 active —— 单次原子更新
            if (cur.active === 'A') {
              return { ...cur, B: bg, active: 'B' };
            } else {
              return { ...cur, A: bg, active: 'A' };
            }
          });
          // 过渡时长 500ms 后解除锁定
          setTimeout(() => { switching.current = false; }, 550);
        };

        if (nextBg.type === 'image') {
          preloadImage(nextBg.url).then(() => doSwitch(nextBg));
        } else {
          // 视频：直接切，浏览器流式加载
          doSwitch(nextBg);
        }

        return next;
      });
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ---- 窗口管理 ----
  const openWindow = useCallback((category) => {
    setWindows(prev => {
      const exists = prev.find(w => w.id === category.id);
      if (exists) {
        return prev.map(w =>
          w.id === category.id ? { ...w, zIndex: ++zCounter } : w
        );
      }
      const offset = prev.length * 28;
      return [...prev, {
        id:       category.id,
        label:    category.label,
        category: category.notion_category,
        type:     category.type,
        x: Math.max(40, (window.innerWidth  / 2 - 320) + offset),
        y: Math.max(40, (window.innerHeight / 2 - 240) + offset),
        zIndex: ++zCounter,
      }];
    });
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, zIndex: ++zCounter } : w
    ));
  }, []);

  const openIds = windows.map(w => w.id);

  // 公用背景层样式生成器
  const bgLayerStyle = (bg, visible) => ({
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    background: bg.type === 'image'
      ? `url(${bg.url}) center/cover no-repeat`
      : undefined,
    filter: 'saturate(0.6) brightness(0.82)',
    transform: 'scale(1.02)',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.5s ease',
    pointerEvents: 'none',
  });

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>

      {/* 背景层 A */}
      <div style={bgLayerStyle(layers.A, layers.active === 'A')}>
        {layers.A.type === 'video' && (
          <video
            key={layers.A.id}
            src={layers.A.url}
            autoPlay muted loop playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      {/* 背景层 B */}
      <div style={bgLayerStyle(layers.B, layers.active === 'B')}>
        {layers.B.type === 'video' && (
          <video
            key={layers.B.id}
            src={layers.B.url}
            autoPlay muted loop playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      {/* Color grade overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(135deg, rgba(201,168,130,0.08) 0%, rgba(26,20,16,0.35) 100%)',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div className="vignette" />

      {/* Desktop icons */}
      <Desktop openWindows={openIds} onOpen={openWindow} />

      {/* Windows */}
      <AnimatePresence>
        {windows.map(win => (
          <Window
            key={win.id}
            id={win.id}
            category={win.category}
            label={win.label}
            type={win.type}
            initialX={win.x}
            initialY={win.y}
            zIndex={win.zIndex}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          />
        ))}
      </AnimatePresence>

      {/* Dock */}
      <Dock openWindows={openIds} onOpen={openWindow} />

      {/* Music */}
      <MusicPlayer />
    </div>
  );
}
