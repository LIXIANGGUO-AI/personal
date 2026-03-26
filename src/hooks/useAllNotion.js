import { useState, useEffect } from 'react';
import { MOCK_DATA } from '../data/mockData';
import { CATEGORIES } from '../constants/categories';

// ============================================
// useAllNotion — 汇总所有分类数据，按年分组
// 返回：{ grouped: Map<year, items[]>, loading, error }
// ============================================

const USE_MOCK = false;

// 分类 -> 颜色色标（与桌面图标色调保持一致）
export const CATEGORY_COLORS = {
  Writings:  '#c9a882',  // 暖棕
  Images:    '#8fa8c8',  // 蓝灰
  Documents: '#b0a090',  // 纸张灰
  Moving:    '#a88fa8',  // 紫灰
  Archive:   '#90a890',  // 苔藓绿
};

export function useAllNotion() {
  const [grouped, setGrouped] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        let all = [];

        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 600));
          // 合并所有分类，给每条记录附上 category 字段
          for (const cat of CATEGORIES) {
            if (!cat.notion_category) continue;
            const items = MOCK_DATA[cat.notion_category] || [];
            items.forEach(item => {
              all.push({ ...item, category: cat.notion_category, categoryLabel: cat.label });
            });
          }
        } else {
          // 生产模式：并行请求
          const fetches = CATEGORIES
            .filter(c => c.notion_category)
            .map(cat =>
              fetch(`/api/notion?category=${encodeURIComponent(cat.notion_category)}`)
                .then(r => r.json())
                .then(items => items.map(i => ({ ...i, category: cat.notion_category, categoryLabel: cat.label })))
                .catch(() => [])
            );
          const results = await Promise.all(fetches);
          all = results.flat();
        }

        // 按年降序排序 → 按年分组
        all.sort((a, b) => (b.year || 0) - (a.year || 0));

        const map = new Map();
        for (const item of all) {
          const y = item.year || '未知年份';
          if (!map.has(y)) map.set(y, []);
          map.get(y).push(item);
        }

        setGrouped(map);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return { grouped, loading, error };
}
