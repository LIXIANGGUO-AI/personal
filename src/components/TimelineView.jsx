import { motion } from 'framer-motion';
import { useAllNotion, CATEGORY_COLORS } from '../hooks/useAllNotion';

// ============================================
// TimelineView — 编年史式时间轴展示
// ============================================

// 分类标签徽章
function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || '#888';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.1em',
      color,
      opacity: 0.9,
      textTransform: 'uppercase',
    }}>
      <span style={{
        width: 6, height: 6,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }} />
      {category}
    </span>
  );
}

// 单条记录
function TimelineItem({ item, index }) {
  const hasCover = item.cover && item.type !== 'text' && item.type !== 'pdf';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        paddingLeft: 28,
        paddingBottom: 16,
        position: 'relative',
      }}
    >
      {/* 时间轴节点圆点 */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 4,
        width: 7,
        height: 7,
        borderRadius: '50%',
        border: '1.5px solid rgba(245,240,232,0.5)',
        background: 'rgba(26,20,16,0.8)',
        flexShrink: 0,
      }} />

      {/* 缩略图（仅图像、视频类有） */}
      {hasCover && (
        <img
          src={item.cover}
          alt={item.title}
          style={{
            width: 48,
            height: 36,
            objectFit: 'cover',
            borderRadius: 4,
            flexShrink: 0,
            opacity: 0.85,
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}

      {/* 文字信息 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(245,240,232,0.92)',
          marginBottom: 3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CategoryBadge category={item.category} />
          {item.description && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'rgba(245,240,232,0.4)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 200,
            }}>
              {item.description}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// 年份区块
function YearSection({ year, items, yearIndex }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: yearIndex * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 12 }}
    >
      {/* 年份标题 + 横线 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
        paddingBottom: 8,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: 'rgba(245,240,232,0.95)',
          lineHeight: 1,
        }}>
          {year}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'rgba(245,240,232,0.3)',
          letterSpacing: '0.1em',
        }}>
          {items.length} entries
        </span>
      </div>

      {/* 条目列表（左侧一根细竖线） */}
      <div style={{
        borderLeft: '1px solid rgba(255,255,255,0.12)',
        marginLeft: 3,
      }}>
        {items.map((item, i) => (
          <TimelineItem key={item.id} item={item} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

// 加载骨架
function Skeleton() {
  return (
    <div style={{ padding: 24 }}>
      {[2024, 2023, 2022].map(y => (
        <div key={y} style={{ marginBottom: 28 }}>
          <div style={{
            width: 60, height: 22,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.06)',
            marginBottom: 14,
            animation: 'pulse 1.4s ease-in-out infinite',
          }} />
          {[1,2,3].slice(0, y === 2024 ? 3 : 2).map(i => (
            <div key={i} style={{
              height: 14,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.04)',
              marginBottom: 10,
              marginLeft: 28,
              animation: 'pulse 1.4s ease-in-out infinite',
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function TimelineView() {
  const { grouped, loading, error } = useAllNotion();

  if (loading) return <Skeleton />;
  if (error) return (
    <div style={{
      padding: 24,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'rgba(201,168,130,0.7)',
    }}>
      Failed to load timeline: {error}
    </div>
  );
  if (!grouped || grouped.size === 0) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', fontFamily: 'var(--font-body)', fontStyle: 'italic',
      fontSize: 14, color: 'rgba(245,240,232,0.4)',
    }}>
      No records yet.
    </div>
  );

  const years = [...grouped.keys()];

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      padding: '24px 28px',
      boxSizing: 'border-box',
    }}>
      {/* 页头 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.2em',
          color: 'rgba(245,240,232,0.35)',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          The Archive · Chronicle
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 18,
          color: 'rgba(245,240,232,0.85)',
        }}>
          All Records by Year
        </div>
      </div>

      {/* 分年区块 */}
      {years.map((year, i) => (
        <YearSection
          key={year}
          year={year}
          items={grouped.get(year)}
          yearIndex={i}
        />
      ))}

      {/* 底部留白 */}
      <div style={{ height: 40 }} />
    </div>
  );
}
