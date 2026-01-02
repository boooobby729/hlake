/**
 * Coze API 调用工具函数
 * 
 * 使用方法：
 * 1. 设置 COZE_API_TOKEN 和 COZE_WORKFLOW_ID
 * 2. 调用 chatWithBot(userMessage) 发送消息并获取回复
 */

// ==================== 配置区域 - 请在这里填写你的信息 ====================
// 默认配置（如果 localStorage 中没有配置，将使用这些值）
// 
// API 调用示例（curl）:
// curl -X POST 'https://api.coze.cn/v1/workflows/chat' \
// -H "Authorization: Bearer pat_Bwj19XEVSglRJZhNjnuQ2aY0ZUB5CcK6SzGiSunRZSADkZRyR5UHbH3vMe5UJpT4" \
// -H "Content-Type: application/json" \
// -d '{
//   "workflow_id": "7588851266873720832",
//   "parameters": {
//     "CONVERSATION_NAME": "Default",
//     "USER_INPUT": "进入湖心"
//   },
//   "additional_messages": [
//     {
//       "content": "进入湖心",
//       "content_type": "text",
//       "role": "user",
//       "type": "question"
//     }
//   ],
//   "workflow_version": "v0.0.23"
// }'
//
const DEFAULT_COZE_API_TOKEN = 'pat_Bwj19XEVSglRJZhNjnuQ2aY0ZUB5CcK6SzGiSunRZSADkZRyR5UHbH3vMe5UJpT4'; // Coze API Token
const DEFAULT_COZE_WORKFLOW_ID = '7588851266873720832'; // Workflow ID

// 从 localStorage 读取配置，如果没有则使用默认值
const getConfig = () => {
  try {
    const storedToken = localStorage.getItem('coze_api_token');
    const storedWorkflowId = localStorage.getItem('coze_workflow_id');
    return {
      token: storedToken || DEFAULT_COZE_API_TOKEN,
      workflowId: storedWorkflowId || DEFAULT_COZE_WORKFLOW_ID,
    };
  } catch (e) {
    console.warn('无法读取 localStorage，使用默认配置:', e);
    return {
      token: DEFAULT_COZE_API_TOKEN,
      workflowId: DEFAULT_COZE_WORKFLOW_ID,
    };
  }
};

// 获取配置的函数
const COZE_API_TOKEN = () => getConfig().token;
const COZE_WORKFLOW_ID = () => getConfig().workflowId;

// 保存配置到 localStorage
export const saveCozeConfig = (token, workflowId) => {
  try {
    if (token) {
      localStorage.setItem('coze_api_token', token);
    }
    if (workflowId) {
      localStorage.setItem('coze_workflow_id', workflowId);
    }
    return true;
  } catch (e) {
    console.error('保存配置失败:', e);
    return false;
  }
};

// 获取配置（用于配置界面显示）
export const getCozeConfig = () => {
  const config = getConfig();
  return {
    token: config.token,
    workflowId: config.workflowId,
  };
};

// API 基础URL（根据环境动态设置）
// 优先尝试使用代理路径 '/api/coze'（如果平台支持代理）
// 如果代理不可用，再回退到直接使用 'https://api.coze.cn'
const getApiBaseUrl = () => {
  // 检查是否在开发环境（有 Vite 开发服务器）
  const isDevelopment = import.meta.env.MODE === 'development';
  
  // 检查是否在本地开发环境（通过 hostname 判断）
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0' ||
    window.location.hostname.includes('localhost')
  );
  
  // 检查是否在 NoCode 平台内（通过 window.NoCode 判断）
  const isInNoCodePlatform = typeof window !== 'undefined' && typeof window.NoCode !== 'undefined';
  
  // 判断逻辑：
  // 1. 如果是开发环境且是本地地址，使用代理（Vite 代理可用）
  // 2. 如果在 NoCode 平台内，也尝试使用代理路径（如果平台配置了代理）
  // 3. 生产环境（Vercel）使用代理路径，通过 Vercel Serverless Function 处理
  // 4. 否则直接使用 API 地址（可能遇到 CORS 问题）
  const useProxy = (isDevelopment && isLocalhost) || isInNoCodePlatform || !isLocalhost;
  const apiBaseUrl = useProxy ? '/api/coze' : 'https://api.coze.cn';
  
  console.log('[Coze API] URL 选择:', {
    isDevelopment,
    isLocalhost,
    isInNoCodePlatform,
    useProxy,
    apiBaseUrl,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown'
  });
  
  return apiBaseUrl;
};

// ==================== API 调用函数 ====================

/**
 * 创建会话
 * @returns {Promise<string>} 返回会话ID (conversation_id)
 */
export const createConversation = async () => {
  try {
    const apiBaseUrl = getApiBaseUrl();
    console.log('创建会话 - 请求URL:', `${apiBaseUrl}/v1/conversation/create`);
    const response = await fetch(`${apiBaseUrl}/v1/conversation/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_TOKEN()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: '7394767730747981878', // 如果仍然需要创建会话，使用固定的 bot_id（如果不需要可以删除此函数）
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `创建会话失败 (HTTP ${response.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error?.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('创建会话完整响应:', JSON.stringify(data, null, 2));
    
    // 尝试多种可能的字段路径来提取conversation_id
    let conversationId = 
      data.data?.conversation_id || 
      data.data?.id ||
      data.conversation_id || 
      data.id ||
      data.conversation?.id ||
      data.conversation?.conversation_id ||
      data.result?.conversation_id ||
      data.result?.id;
    
    if (!conversationId) {
      console.error('无法从响应中提取conversation_id');
      console.error('响应数据结构:', JSON.stringify(data, null, 2));
      console.error('尝试的字段路径:');
      console.error('  - data.data?.conversation_id');
      console.error('  - data.data?.id');
      console.error('  - data.conversation_id');
      console.error('  - data.id');
      console.error('  - data.conversation?.id');
      console.error('  - data.conversation?.conversation_id');
      console.error('  - data.result?.conversation_id');
      console.error('  - data.result?.id');
      throw new Error('创建会话成功但未返回会话ID，请查看控制台查看完整响应结构');
    }

    console.log('成功提取会话ID:', conversationId);
    return conversationId;
  } catch (error) {
    console.error('创建会话失败:', error);
    throw error;
  }
};

/**
 * 发送消息并获取回复（使用 Coze Workflow API）
 * @param {string} conversationId - 会话ID（可选，workflow API可能不需要）
 * @param {string} userMessage - 用户消息
 * @param {boolean} stream - 是否使用流式返回（默认false）
 * @returns {Promise<string>} 返回机器人的回复内容
 */
export const sendMessage = async (conversationId, userMessage, stream = false) => {
  try {
    // 使用 Coze Workflows Chat 端点
    const apiBaseUrl = getApiBaseUrl();
    const workflowUrl = `${apiBaseUrl}/v1/workflows/chat`;
    const currentWorkflowId = COZE_WORKFLOW_ID();
    console.log('运行工作流 - 请求URL:', workflowUrl);
    console.log('运行工作流 - Workflow ID:', currentWorkflowId);
    console.log('运行工作流 - 用户消息:', userMessage);
    
    // 根据新的 API 格式构建请求体
    const requestBody = {
      workflow_id: currentWorkflowId,
      parameters: {
        CONVERSATION_NAME: 'Default',
        USER_INPUT: userMessage || '',
      },
      additional_messages: [
        {
          content: userMessage || '',
          content_type: 'text',
          role: 'user',
          type: 'question',
        },
      ],
      workflow_version: 'v0.0.23', // 指定工作流版本
    };
    
    const currentToken = COZE_API_TOKEN();
    console.log('运行工作流 - 请求体:', JSON.stringify(requestBody, null, 2));
    console.log('运行工作流 - Authorization头:', `Bearer ${currentToken ? currentToken.substring(0, 15) + '...' : '未设置'}`);
    console.log('运行工作流 - Token长度:', currentToken ? currentToken.length : 0);
    
    let response;
    try {
      response = await fetch(workflowUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      console.log('运行工作流 - 响应状态:', response.status, response.statusText);
    } catch (fetchError) {
      // 捕获网络错误（如 CORS、网络连接失败等）
      console.error('运行工作流 - 网络请求失败:', fetchError);
      console.error('错误类型:', fetchError.name);
      console.error('错误消息:', fetchError.message);
      
      // 检查是否是 CORS 错误
      const isCorsError = fetchError.message.includes('Failed to fetch') || 
                         fetchError.message.includes('CORS') ||
                         fetchError.name === 'TypeError';
      
      // 检查是否在 NoCode 平台内
      const isInNoCodePlatform = typeof window !== 'undefined' && typeof window.NoCode !== 'undefined';
      
      let errorMessage = '网络请求失败';
      if (isCorsError && isInNoCodePlatform) {
        errorMessage = '在平台内无法直接访问 Coze API（CORS 限制）。\n\n解决方案：\n1. 请在 NoCode 平台配置服务器端代理\n2. 将 /api/coze 路径代理到 https://api.coze.cn\n3. 或联系平台管理员配置代理\n\n如果已配置代理但仍出现此错误，请检查代理配置是否正确。';
      } else if (isCorsError) {
        errorMessage = 'CORS 错误：无法访问 Coze API。请检查网络连接或代理配置。';
      } else if (fetchError.message.includes('network') || fetchError.message.includes('Network')) {
        errorMessage = '网络连接失败，请检查网络设置。';
      } else {
        errorMessage = `网络请求失败: ${fetchError.message || '未知错误'}`;
      }
      
      throw new Error(errorMessage);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      const currentToken = COZE_API_TOKEN();
      console.error('运行工作流失败 - HTTP状态:', response.status);
      console.error('运行工作流失败 - 响应内容:', errorText);
      console.error('运行工作流失败 - 请求URL:', workflowUrl);
      console.error('运行工作流失败 - 使用的Token:', currentToken ? `${currentToken.substring(0, 10)}...` : '未设置');
      console.error('运行工作流失败 - Authorization头:', `Bearer ${currentToken ? '已设置' : '未设置'}`);
      
      let errorMessage = `运行工作流失败 (HTTP ${response.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error?.message || errorData.error || errorMessage;
        console.error('运行工作流失败 - 错误详情:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      // 401错误的特殊提示
      if (response.status === 401) {
        const currentToken = COZE_API_TOKEN();
        const tokenPrefix = currentToken ? currentToken.substring(0, 15) : '未设置';
        const tokenLength = currentToken ? currentToken.length : 0;
        const tokenSuffix = currentToken && currentToken.length > 20 ? currentToken.substring(currentToken.length - 10) : '';
        
        errorMessage = `API认证失败 (401)。可能的原因：1) API Token无效或已过期 2) Token格式不正确 3) 请检查Token是否正确配置。当前使用的Token前缀: ${tokenPrefix}... 后缀: ...${tokenSuffix} (长度: ${tokenLength})`;
        console.error('========== 401 认证失败 ==========');
        console.error('Token前缀:', tokenPrefix);
        console.error('Token后缀:', tokenSuffix);
        console.error('Token长度:', tokenLength);
        console.error('Token格式检查:');
        console.error('  - Token是否以 "cztei_" 或 "pat_" 开头:', currentToken ? (currentToken.startsWith('cztei_') || currentToken.startsWith('pat_')) : false);
        console.error('  - Token是否包含空格:', currentToken ? currentToken.includes(' ') : false);
        console.error('  - Token是否包含换行符:', currentToken ? currentToken.includes('\n') : false);
        console.error('请确认：');
        console.error('  1) 在 Coze 控制台检查 Token 是否已过期');
        console.error('  2) 重新生成新的 API Token');
        console.error('  3) 确保 Token 没有多余的空格或换行符');
        console.error('  4) 确保 Token 有访问该 Workflow 的权限');
        console.error('===================================');
      }
      
      // 404错误的特殊提示
      if (response.status === 404) {
        errorMessage = `API端点不存在 (404)。请检查：1) API路径是否正确 2) 代理配置是否正确 3) Coze API文档中的正确端点`;
        console.error('404错误提示: 请检查API端点路径，可能路径不正确');
      }
      
      throw new Error(errorMessage);
    }

    // Workflows Chat API 可能返回 SSE (Server-Sent Events) 流式数据或 JSON
    const contentType = response.headers.get('content-type') || '';
    
    let replyText = '';
    let fullResponseData = [];
    
    if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
      // 处理 SSE 格式的流式响应
      console.log('检测到 SSE 流式响应，开始解析...');
      
      const text = await response.text();
      console.log('运行工作流 - 原始响应（SSE）:', text.substring(0, 500));
      
      // 解析 SSE 格式 - 重新设计，避免重复提取
      const lines = text.split('\n');
      let currentEvent = null;
      let currentData = '';
      let eventType = null;
      
      // 用于存储已提取的内容片段，避免重复
      // 使用更智能的去重：不仅检查完全相同的字符串，还检查是否已经包含
      const extractedChunks = [];
      let accumulatedText = ''; // 累积的完整文本，用于检查重复
      
      // 检查内容是否已经包含在已提取的内容中
      const isContentDuplicate = (newContent) => {
        if (!newContent || newContent.trim().length === 0) return true;
        const newContentClean = newContent.trim();
        
        // 如果累积文本为空，肯定不是重复
        if (accumulatedText.length === 0) return false;
        
        // 检查新内容是否与累积文本完全相同
        if (accumulatedText === newContentClean) {
          return true;
        }
        
        // 检查新内容是否已经包含在累积文本中
        if (accumulatedText.includes(newContentClean)) {
          return true;
        }
        
        // 检查累积文本是否已经包含在新内容中（新内容可能是完整版本）
        if (newContentClean.includes(accumulatedText)) {
          // 如果新内容更长，说明是完整版本，需要替换
          return false; // 允许替换
        }
        
        // 检查是否有大量重叠（超过80%的内容重叠）
        const overlapThreshold = Math.min(newContentClean.length, accumulatedText.length) * 0.8;
        if (overlapThreshold > 0) {
          // 简单的重叠检查：计算公共子串
          let maxOverlap = 0;
          for (let i = 0; i <= newContentClean.length - 10; i++) {
            for (let j = 0; j <= accumulatedText.length - 10; j++) {
              let overlap = 0;
              while (i + overlap < newContentClean.length && 
                     j + overlap < accumulatedText.length &&
                     newContentClean[i + overlap] === accumulatedText[j + overlap]) {
                overlap++;
              }
              maxOverlap = Math.max(maxOverlap, overlap);
            }
          }
          if (maxOverlap >= overlapThreshold) {
            return true; // 大量重叠，认为是重复
          }
        }
        
        return false;
      };
      
      // 递归提取文本内容的辅助函数
      const extractTextFromObject = (obj, depth = 0) => {
        if (depth > 5) return null; // 防止无限递归
        
        if (typeof obj === 'string') {
          // 验证字符串是否有效
          if (obj.trim().length > 0 && 
              /[\u4e00-\u9fff]/.test(obj) &&
              !obj.match(/^\s*\{[\s\S]*\}\s*$/) && // 不是纯 JSON
              !obj.match(/^(msg_type|generate_answer|finish_reason|event|id|data)/i)) { // 不是系统消息
            return obj;
          }
          return null;
        }
        
        if (typeof obj !== 'object' || obj === null) return null;
        
        // 跳过系统消息对象
        if (obj.msg_type || (obj.node_type && obj.node_type !== 'End') || obj.finish_reason) {
          return null;
        }
        
        // 优先检查 content 字段（最可靠）
        if (obj.content) {
          const content = typeof obj.content === 'string' 
            ? obj.content 
            : extractTextFromObject(obj.content, depth + 1);
          if (content && typeof content === 'string' && 
              content.trim().length > 0 && 
              /[\u4e00-\u9fff]/.test(content)) {
            return content;
          }
        }
        
        // 检查其他可能的文本字段
        for (const key of ['text', 'output', 'result', 'message', 'answer', 'reply']) {
          if (obj[key]) {
            const value = typeof obj[key] === 'string' 
              ? obj[key]
              : extractTextFromObject(obj[key], depth + 1);
            if (value && typeof value === 'string' && 
                value.trim().length > 0 && 
                /[\u4e00-\u9fff]/.test(value)) {
              return value;
            }
          }
        }
        
        return null;
      };
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('id:')) {
          continue;
        } else if (line.startsWith('event:')) {
          eventType = line.substring(6).trim();
        } else if (line.startsWith('data:')) {
          currentData = line.substring(5).trim();
          
          // 尝试解析 JSON 数据
          try {
            const jsonData = JSON.parse(currentData);
            fullResponseData.push(jsonData);
            
            console.log('SSE 消息事件:', eventType, '节点类型:', jsonData.node_type);
            
            // 只从每个消息中提取一次内容，避免重复
            // 优先级：node_type === 'End' 的 content > data.content > data.output > 其他
            let extractedContent = null;
            
            // 优先级1: node_type === 'End' 的 content（最终结果）
            if (jsonData.node_type === 'End' && jsonData.content) {
              extractedContent = extractTextFromObject(jsonData.content);
              if (extractedContent) {
                console.log('✅ 从 End 节点提取内容:', extractedContent.substring(0, 100));
              }
            }
            
            // 优先级2: data.content
            if (!extractedContent && jsonData.data?.content) {
              extractedContent = extractTextFromObject(jsonData.data.content);
              if (extractedContent) {
                console.log('✅ 从 data.content 提取内容:', extractedContent.substring(0, 100));
              }
            }
            
            // 优先级3: data.output
            if (!extractedContent && jsonData.data?.output) {
              extractedContent = extractTextFromObject(jsonData.data.output);
              if (extractedContent) {
                console.log('✅ 从 data.output 提取内容:', extractedContent.substring(0, 100));
              }
            }
            
            // 优先级4: 根级别的 content
            if (!extractedContent && jsonData.content) {
              extractedContent = extractTextFromObject(jsonData.content);
              if (extractedContent) {
                console.log('✅ 从根 content 提取内容:', extractedContent.substring(0, 100));
              }
            }
            
            // 优先级5: data 字段（如果是字符串）
            if (!extractedContent && jsonData.data && typeof jsonData.data === 'string') {
              extractedContent = extractTextFromObject(jsonData.data);
              if (extractedContent) {
                console.log('✅ 从 data 字符串提取内容:', extractedContent.substring(0, 100));
              }
            }
            
            // 如果提取到内容，检查是否重复，然后添加
            if (extractedContent) {
              // 检查是否是重复内容
              if (!isContentDuplicate(extractedContent)) {
                // 如果新内容包含了已累积的内容，替换它
                const newContentClean = extractedContent.trim();
                if (accumulatedText && newContentClean.includes(accumulatedText)) {
                  console.log('🔄 发现更完整的内容，替换旧内容');
                  replyText = newContentClean; // 替换为完整版本
                  accumulatedText = newContentClean;
                  extractedChunks.length = 0; // 清空chunks，只保留新的
                  extractedChunks.push(newContentClean);
                } else {
                  extractedChunks.push(newContentClean);
                  replyText += extractedContent;
                  accumulatedText = replyText.trim();
                }
              } else {
                console.log('⚠️ 跳过重复内容:', extractedContent.substring(0, 50));
              }
            }
            
          } catch (e) {
            // 如果不是 JSON，忽略这行
            console.warn('无法解析 SSE 数据行:', currentData.substring(0, 100));
          }
        } else if (line === '') {
          // 空行表示一个事件结束，重置
          currentEvent = null;
          currentData = '';
        }
      }
      
      console.log('========== SSE 解析完成 ==========');
      console.log('提取的内容:', replyText);
      console.log('提取的内容长度:', replyText.length);
      console.log('完整响应数据数量:', fullResponseData.length);
      console.log('完整响应数据:', JSON.stringify(fullResponseData, null, 2));
      console.log('===================================');
      
      if (!replyText || replyText.trim().length === 0) {
        // 如果没能提取到内容，尝试从所有消息中提取
        console.warn('未能直接提取内容，尝试从所有消息中提取...');
        
        // 递归查找函数
        const findTextInObject = (obj, depth = 0) => {
          if (depth > 5) return ''; // 防止无限递归
          if (typeof obj === 'string' && obj.trim().length > 0 && /[\u4e00-\u9fff]/.test(obj)) {
            return obj;
          }
          if (typeof obj !== 'object' || obj === null) return '';
          
          // 跳过系统消息
          if (obj.msg_type || (obj.node_type && obj.node_type !== 'End')) {
            return '';
          }
          
          // 检查常见的文本字段
          for (const key of ['content', 'text', 'output', 'result', 'message', 'answer', 'reply']) {
            if (obj[key]) {
              const value = typeof obj[key] === 'string' 
                ? obj[key] 
                : findTextInObject(obj[key], depth + 1);
              if (value && value.trim().length > 0 && /[\u4e00-\u9fff]/.test(value)) {
                return value;
              }
            }
          }
          
          return '';
        };
        
        // 遍历所有消息，累积所有找到的内容（但要去重）
        for (const msg of fullResponseData) {
          const found = findTextInObject(msg);
          if (found) {
            const foundClean = found.trim();
            // 检查是否是重复内容
            if (!isContentDuplicate(foundClean)) {
              // 如果新内容包含了已累积的内容，替换它
              if (accumulatedText && foundClean.includes(accumulatedText)) {
                console.log('🔄 发现更完整的内容，替换旧内容');
                replyText = foundClean;
                accumulatedText = foundClean;
                extractedChunks.length = 0;
                extractedChunks.push(foundClean);
              } else {
                extractedChunks.push(foundClean);
                replyText += found;
                accumulatedText = replyText.trim();
              }
              console.log('从消息中提取内容:', foundClean.substring(0, 100));
            } else {
              console.log('⚠️ 跳过重复内容:', foundClean.substring(0, 50));
            }
          }
        }
      }
      
      if (!replyText || replyText.trim().length === 0) {
        console.warn('无法从 SSE 响应中提取回复内容');
        console.warn('完整响应数据:', JSON.stringify(fullResponseData, null, 2));
        throw new Error('API返回的数据格式不正确，无法提取回复内容，请查看控制台查看完整响应');
      }
      
      // 计算两个字符串的相似度（简单的Jaccard相似度）
      const calculateSimilarity = (str1, str2) => {
        const set1 = new Set(str1.split(''));
        const set2 = new Set(str2.split(''));
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        return intersection.size / union.size;
      };
      
      // 最终去重：去除重复的句子和段落
      const finalDeduplicate = (text) => {
        if (!text || text.trim().length === 0) return text;
        
        // 首先检查是否有明显的重复块（整个文本重复两次）
        const textTrimmed = text.trim();
        const halfLength = Math.floor(textTrimmed.length / 2);
        const firstHalf = textTrimmed.substring(0, halfLength);
        const secondHalf = textTrimmed.substring(halfLength);
        
        // 如果前半部分和后半部分高度相似，说明整个文本重复了
        if (firstHalf.length > 20 && secondHalf.length > 20) {
          const similarity = calculateSimilarity(firstHalf, secondHalf);
          if (similarity > 0.8) {
            console.log('⚠️ 检测到整个文本重复，只保留前半部分');
            return firstHalf.trim();
          }
        }
        
        // 按句子分割（以句号、问号、感叹号结尾）
        const sentences = text.match(/[^。！？?]+[。！？?]/g) || [];
        const uniqueSentences = [];
        const seenSentences = new Map(); // 使用Map来存储，方便替换
        
        for (const sentence of sentences) {
          const sentenceClean = sentence.trim();
          if (sentenceClean.length < 3) continue;
          
          // 检查是否已经存在（完全匹配或包含关系）
          let foundDuplicate = false;
          for (const [seen, original] of seenSentences.entries()) {
            if (seen === sentenceClean) {
              foundDuplicate = true;
              break;
            }
            // 检查包含关系
            if (seen.includes(sentenceClean)) {
              foundDuplicate = true;
              break;
            }
            if (sentenceClean.includes(seen)) {
              // 新句子更长，替换旧的
              const index = uniqueSentences.indexOf(original);
              if (index !== -1) {
                uniqueSentences[index] = sentence;
                seenSentences.delete(seen);
                seenSentences.set(sentenceClean, sentence);
              }
              foundDuplicate = true;
              break;
            }
          }
          
          if (!foundDuplicate) {
            uniqueSentences.push(sentence);
            seenSentences.set(sentenceClean, sentence);
          }
        }
        
        // 重新组合
        let result = uniqueSentences.join('');
        // 处理剩余的文本（不在句子中的部分）
        const remaining = text.replace(/[^。！？?]+[。！？?]/g, '').trim();
        if (remaining && !result.includes(remaining)) {
          result += remaining;
        }
        
        return result.trim();
      };
      
      replyText = finalDeduplicate(replyText);
      
      console.log('成功提取回复内容（已去重）:', replyText);
      return replyText;
      
    } else {
      // 如果不是 SSE，尝试作为普通 JSON 处理
      const data = await response.json();
      console.log('运行工作流完整响应:', JSON.stringify(data, null, 2));
      
      // 对于非 SSE 响应，尝试从 JSON 中提取内容
      let replyText = '';
      
      // 方式1: data.data.output 或 data.data.result
      if (data.data?.output) {
        replyText = typeof data.data.output === 'string' 
          ? data.data.output 
          : data.data.output.text || data.data.output.content || data.data.output.message || '';
      }
      else if (data.data?.result) {
        replyText = typeof data.data.result === 'string'
          ? data.data.result
          : data.data.result.text || data.data.result.content || data.data.result.message || '';
      }
      // 方式2: data.output 或 data.result
      else if (data.output) {
        replyText = typeof data.output === 'string' 
          ? data.output 
          : data.output.text || data.output.content || data.output.message || '';
      }
      else if (data.result) {
        replyText = typeof data.result === 'string'
          ? data.result
          : data.result.text || data.result.content || data.result.message || '';
      }
      // 方式3: data.content 或 data.message
      else if (data.data?.content) {
        replyText = typeof data.data.content === 'string' 
          ? data.data.content 
          : data.data.content.text || data.data.content.content || data.data.content.message || '';
      }
      else if (data.content) {
        replyText = typeof data.content === 'string' ? data.content : (data.content.text || data.content.content || data.content.message || '');
      }
      else if (data.message) {
        replyText = typeof data.message === 'string' ? data.message : (data.message.text || data.message.content || '');
      }
      // 方式4: 尝试从 data.data 中递归查找
      else if (data.data) {
        // 递归查找包含文本的字段
        const findTextInObject = (obj) => {
          if (typeof obj === 'string' && obj.trim().length > 0) return obj;
          if (typeof obj !== 'object' || obj === null) return '';
          for (const key of ['text', 'content', 'output', 'result', 'message', 'answer', 'reply']) {
            if (obj[key]) {
              const value = obj[key];
              if (typeof value === 'string' && value.trim().length > 0) return value;
              if (typeof value === 'object') {
                const found = findTextInObject(value);
                if (found) return found;
              }
            }
          }
          return '';
        };
        replyText = findTextInObject(data.data);
      }
      
      if (!replyText) {
        console.warn('无法从 JSON 响应中提取回复内容');
        console.warn('完整响应结构:', JSON.stringify(data, null, 2));
        throw new Error('API返回的数据格式不正确，无法提取回复内容，请查看控制台查看完整响应');
      }
      
      console.log('成功提取回复内容:', replyText);
      return replyText;
    }
  } catch (error) {
    console.error('发送消息失败:', error);
    throw error;
  }
};

/**
 * 完整的对话流程（使用 Workflow API）
 * @param {string} userMessage - 用户消息
 * @returns {Promise<{conversationId: string, reply: string}>} 返回会话ID和回复内容
 */
export const chatWithBot = async (userMessage) => {
  try {
    // 使用 Workflow API 运行工作流
    console.log('使用 Workflow API 运行工作流');
    const reply = await sendMessage(null, userMessage);
    console.log('收到回复:', reply);
    
    return {
      conversationId: null, // Workflow API 可能不需要会话ID
      reply,
    };
  } catch (error) {
    console.error('对话失败:', error);
    throw error;
  }
};

// ==================== 使用示例 ====================

/**
 * 使用示例1: 单次对话（自动创建会话）
 */
export const example1 = async () => {
  try {
    const result = await chatWithBot('你好');
    console.log('回复:', result.reply);
  } catch (error) {
    console.error('错误:', error.message);
  }
};

/**
 * 使用示例2: 多次对话（复用同一会话）
 */
export const example2 = async () => {
  try {
    // 创建会话
    const conversationId = await createConversation();
    
    // 第一次对话
    const reply1 = await sendMessage(conversationId, '你好');
    console.log('第一次回复:', reply1);
    
    // 第二次对话（使用同一个会话）
    const reply2 = await sendMessage(conversationId, '你叫什么名字？');
    console.log('第二次回复:', reply2);
  } catch (error) {
    console.error('错误:', error.message);
  }
};





