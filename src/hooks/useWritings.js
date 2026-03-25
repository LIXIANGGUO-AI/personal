import { useState, useCallback } from 'react';
import { MOCK_DATA } from '../data/mockData';

// ============================================
// useWritings — 文字作品本地存储管理
// 使用 localStorage 持久化，mockData 作为初始数据
// ============================================

const STORAGE_KEY = 'museum_writings';

function loadWritings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  // 首次加载：从 mockData 初始化
  const initial = MOCK_DATA.Writings.map(w => ({ ...w }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function persist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useWritings() {
  const [writings, setWritings] = useState(() => loadWritings());

  // 保存（修改）某篇文章
  const saveWriting = useCallback((id, patch) => {
    setWritings(prev => {
      const next = prev.map(w => w.id === id ? { ...w, ...patch } : w);
      persist(next);
      return next;
    });
  }, []);

  // 新建空文章
  const addWriting = useCallback(() => {
    const newItem = {
      id: `w_${Date.now()}`,
      title: '无题',
      year: new Date().getFullYear(),
      description: '',
      type: 'text',
      content: '',
    };
    setWritings(prev => {
      const next = [newItem, ...prev];
      persist(next);
      return next;
    });
    return newItem.id;
  }, []);

  // 删除文章
  const deleteWriting = useCallback((id) => {
    setWritings(prev => {
      const next = prev.filter(w => w.id !== id);
      persist(next);
      return next;
    });
  }, []);

  return { writings, saveWriting, addWriting, deleteWriting };
}
