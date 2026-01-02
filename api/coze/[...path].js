/**
 * Vercel Serverless Function - Coze API 代理
 * 用于解决 CORS 问题，将前端请求代理到 Coze API
 */

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 获取请求路径（去掉 /api/coze 前缀）
    const path = req.query.path ? req.query.path.join('/') : '';
    // 如果路径已经包含 v1，直接使用；否则添加 v1 前缀
    const targetUrl = path.startsWith('v1/') 
      ? `https://api.coze.cn/${path}`
      : `https://api.coze.cn/v1/${path}`;

    console.log('[代理] 转发请求到:', targetUrl);
    console.log('[代理] 请求方法:', req.method);
    console.log('[代理] 请求头:', JSON.stringify(req.headers, null, 2));

    // 转发请求到 Coze API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // 获取响应内容
    const contentType = response.headers.get('content-type') || '';
    let responseData;

    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
      // 处理流式响应
      const text = await response.text();
      // 设置正确的响应头
      res.setHeader('Content-Type', contentType);
      res.status(response.status);
      return res.send(text);
    } else {
      responseData = await response.text();
    }

    // 设置响应头
    res.setHeader('Content-Type', contentType);
    res.status(response.status);

    // 返回响应
    return res.json(responseData);
  } catch (error) {
    console.error('[代理] 错误:', error);
    return res.status(500).json({
      error: 'Proxy error',
      message: error.message,
    });
  }
}
