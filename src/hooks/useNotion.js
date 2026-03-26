import { useState, useEffect, useRef } from 'react';
import { MOCK_DATA } from '../data/mockData';

// ============================================
// useNotion — 数据获取 Hook
// 
// 开发阶段：USE_MOCK = true，使用本地 mockData
// 生产阶段：USE_MOCK = false，请求 /api/notion
// ============================================

const USE_MOCK = false; // 接入 Notion 后改为 false

const cache = {}; // 内存缓存，避免重复请求

export function useNotion(category) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!category) return;

    // 命中缓存直接返回
    if (cache[category]) {
      setData(cache[category]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    abortRef.current = new AbortController();

    const fetchData = async () => {
      try {
        let result;

        if (USE_MOCK) {
          // 模拟网络延迟，让 loading 动画有时间展示
          await new Promise(r => setTimeout(r, 800));
          result = MOCK_DATA[category] || [];
        } else {
          const res = await fetch(`/api/notion?category=${encodeURIComponent(category)}`, {
            signal: abortRef.current.signal,
          });
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          result = await res.json();
        }

        cache[category] = result;
        setData(result);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => abortRef.current?.abort();
  }, [category]);

  return { data, loading, error };
}
