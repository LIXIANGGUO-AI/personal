// ============================================
// /api/notion.js — Vercel Serverless Function
//
// 环境变量（在 Vercel 项目设置里配置）：
//   NOTION_SECRET      = secret_xxxxxxxxxx
//   NOTION_DATABASE_ID = xxxxxxxxxxxxxxxx
//
// 请求示例：GET /api/notion?category=Images
// ============================================

import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_SECRET });

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'category is required' });
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'Category',
        select: { equals: category },
      },
      sorts: [
        { property: 'Featured', direction: 'descending' },
        { property: 'Year',     direction: 'descending' },
      ],
    });

    // 将 Notion 原始结构转换为前端所需格式
    const items = response.results.map(page => {
      const props = page.properties;

      return {
        id: page.id,
        title:       props.Title?.title?.[0]?.plain_text || 'Untitled',
        year:        props.Year?.number || null,
        description: props.Description?.rich_text?.[0]?.plain_text || '',
        type:        props.Type?.select?.name?.toLowerCase() || 'image',
        // 封面图（Files 字段取第一个文件的 URL）
        cover:       props.Cover?.files?.[0]?.file?.url
                  || props.Cover?.files?.[0]?.external?.url
                  || null,
        // 内容文件（PDF 或其他）
        content_url: props.Content?.files?.[0]?.file?.url
                  || props.Content?.files?.[0]?.external?.url
                  || props.Content?.url?.url
                  || null,
        featured:    props.Featured?.checkbox || false,
      };
    });

    return res.status(200).json(items);
  } catch (err) {
    console.error('--- Notion API Detailed Error ---');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Body:', err.body); // Notion API specific error body
    
    // Return a more descriptive error to the frontend if possible
    const errorMessage = err.body ? JSON.parse(err.body).message : err.message;
    return res.status(500).json({ 
      error: errorMessage,
      details: 'Check Vercel logs for full stack trace.'
    });
  }
}
