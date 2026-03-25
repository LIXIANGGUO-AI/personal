// ============================================
// MOCK DATA — Notion 接入前用这份数据开发
// 数据结构与 Notion API 返回格式保持一致
// ============================================

export const MOCK_DATA = {
  Writings: [
    {
      id: 'w1',
      title: '在雾中行走的人',
      year: 2024,
      description: '一篇关于记忆与遗忘的散文，试图用语言捕捉那些正在消散的意象。',
      type: 'text',
      content: `在雾中行走，你永远不知道脚下踩的是坚实的土地还是悬空的幻象。

这座城市在十月的早晨总是这样——一层薄薄的水汽将所有棱角磨圆，将所有声音压低，将所有颜色稀释成同一种苍白的灰。我在其中行走，像一个闯入他人梦境的旁观者。

母亲说，她年轻时候住的那条街已经不存在了。不是拆除，是消失——像从来没有存在过一样，连痕迹都没有留下。我试图想象那种感觉：你所有的记忆突然失去了它们的坐标，悬浮在一个没有地址的虚空里。

也许所有的记忆最终都是这样的命运。`,
    },
    {
      id: 'w2',
      title: '给陌生城市的情书',
      year: 2023,
      description: '旅途中写下的碎片，献给那些只路过一次的地方。',
      type: 'text',
      content: `我从来没有学会怎么告别一座城市。

每次离开，我都会在最后一个早晨多睁眼躺一会儿，听窗外的声音——那些我花了好几天才辨认出来的声音：几点钟的鸟叫声，隔壁摊贩的吆喝，远处某处教堂的钟声。

然后我把它们打包进记忆，带走。

但记忆是个糟糕的容器。声音会在里面慢慢失真，颜色会褪色，气味会最先消失。剩下的只是一个轮廓，越来越像一张明信片。`,
    },
  ],

  Images: [
    {
      id: 'i1',
      title: 'Reverie No. 1',
      year: 2024,
      description: '双重曝光系列',
      type: 'image',
      cover: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
    },
    {
      id: 'i2',
      title: 'Soft Architecture',
      year: 2024,
      description: '建筑与自然的边界',
      type: 'image',
      cover: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
    },
    {
      id: 'i3',
      title: 'Still Life with Memory',
      year: 2023,
      description: '静物摄影',
      type: 'image',
      cover: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?w=800&q=80',
    },
    {
      id: 'i4',
      title: 'The Hour Before',
      year: 2023,
      description: '黄金时刻系列',
      type: 'image',
      cover: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80',
    },
    {
      id: 'i5',
      title: 'Dissolution',
      year: 2022,
      description: '长曝光实验',
      type: 'image',
      cover: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
    },
    {
      id: 'i6',
      title: 'Paper Gardens',
      year: 2022,
      description: '纸艺与光影',
      type: 'image',
      cover: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80',
    },
  ],

  Documents: [
    {
      id: 'd1',
      title: '创作手记 2024',
      year: 2024,
      description: '年度创作复盘与方法论整理',
      type: 'pdf',
      // 替换为真实 PDF URL
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      pages: [
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80',
        'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=600&q=80',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80',
        'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&q=80',
      ],
    },
  ],

  Moving: [
    {
      id: 'v1',
      title: 'Fragment I',
      year: 2024,
      description: '实验短片，时长 3 分 22 秒',
      type: 'video',
      cover: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
  ],

  Archive: [
    {
      id: 'a1',
      title: 'Field Notes 2019–2021',
      year: 2021,
      description: '三年间的田野笔记与草图',
      type: 'image',
      cover: 'https://images.unsplash.com/photo-1494200483823-2c850fa3c68d?w=800&q=80',
    },
    {
      id: 'a2',
      title: 'Collected Ephemera',
      year: 2020,
      description: '票据、标签、邮戳的碎片集',
      type: 'image',
      cover: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
    },
  ],
};
