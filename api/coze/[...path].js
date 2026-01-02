/**
 * Vercel Serverless Function - Coze API 代理
 * 用于解决 CORS 问题，将前端请求代理到 Coze API
 */

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    console.log('[代理] 路径参数:', req.query.path);
    console.log('[代理] Authorization头:', req.headers.authorization ? req.headers.authorization.substring(0, 20) + '...' : '未设置');

    // 转发请求到 Coze API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('[代理] Coze API 响应状态:', response.status, response.statusText);

    // 获取响应内容
    const contentType = response.headers.get('content-type') || '';
    let responseData;

    if (contentType.includes('application/json')) {
      responseData = await response.json();
      console.log('[代理] 响应数据:', JSON.stringify(responseData).substring(0, 200));
    } else if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
      // 处理流式响应
      const text = await response.text();
      console.log('[代理] 流式响应长度:', text.length);
      // 设置正确的响应头
      res.setHeader('Content-Type', contentType);
      res.status(response.status);
      return res.send(text);
    } else {
      responseData = await response.text();
      console.log('[代理] 文本响应:', responseData.substring(0, 200));
    }

    // 设置响应头
    res.setHeader('Content-Type', contentType);
    res.status(response.status);

    // 如果响应不成功，返回错误信息
    if (!response.ok) {
      console.error('[代理] Coze API 错误响应:', responseData);
      return res.status(response.status).json(responseData);
    }

    // 返回响应
    return res.json(responseData);
  } catch (error) {
    console.error('[代理] 错误:', error);
    console.error('[代理] 错误堆栈:', error.stack);
    return res.status(500).json({
      error: 'Proxy error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
