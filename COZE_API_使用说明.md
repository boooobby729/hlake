# Coze API 调用代码使用说明

## 📝 配置文件位置

所有代码在 `src/utils/cozeApi.js` 文件中。

## 🔧 配置步骤

1. 打开 `src/utils/cozeApi.js` 文件
2. 找到配置区域（文件开头），填写以下信息：

```javascript
const COZE_API_TOKEN = '你的API_TOKEN'; // 👈 在这里填写你的 Coze API Token
const COZE_BOT_ID = '你的BOT_ID';      // 👈 在这里填写你的 Bot ID
```

## 📋 主要函数说明

### 1. `createConversation()`
创建新的会话，返回会话ID。

```javascript
const conversationId = await createConversation();
```

### 2. `sendMessage(conversationId, userMessage)`
发送消息并获取回复。

参数：
- `conversationId`: 会话ID（从 `createConversation()` 获取）
- `userMessage`: 用户发送的消息文本

返回：机器人的回复内容（字符串）

```javascript
const reply = await sendMessage(conversationId, '你好');
```

### 3. `chatWithBot(userMessage)`
完整的对话流程，自动创建会话并发送消息（适合单次对话）。

```javascript
const { conversationId, reply } = await chatWithBot('你好');
```

## 💡 使用示例

### 在 React 组件中使用

```javascript
import { chatWithBot, createConversation, sendMessage } from '../utils/cozeApi';

// 方式1: 单次对话（推荐用于简单场景）
const handleSubmit = async (message) => {
  try {
    const { reply } = await chatWithBot(message);
    console.log('机器人回复:', reply);
  } catch (error) {
    console.error('错误:', error.message);
  }
};

// 方式2: 多次对话（推荐用于需要上下文对话的场景）
const [conversationId, setConversationId] = useState(null);

const handleSubmit = async (message) => {
  try {
    // 如果没有会话，先创建一个
    if (!conversationId) {
      const id = await createConversation();
      setConversationId(id);
    }
    
    // 发送消息
    const reply = await sendMessage(conversationId, message);
    console.log('机器人回复:', reply);
  } catch (error) {
    console.error('错误:', error.message);
  }
};
```

## ⚙️ API 配置

### 开发环境（使用代理）
默认配置已经设置为使用代理，无需修改：
```javascript
const API_BASE_URL = '/api/coze';
```

### 生产环境
如果生产环境也需要使用代理，保持当前配置即可。
如果生产环境可以直接访问 API，可以修改为：
```javascript
const API_BASE_URL = 'https://api.coze.cn';
```

## 🔍 调试提示

如果遇到问题，请检查：
1. ✅ API Token 是否正确填写
2. ✅ Bot ID 是否正确填写
3. ✅ 代理配置是否正确（vite.config.js 中的 `/api/coze` 代理）
4. ✅ 查看浏览器控制台的错误信息

## 📚 更多信息

- Coze API 官方文档：https://www.coze.cn/open/apidocs
- 代码示例在 `src/utils/cozeApi.js` 文件底部的 `example1` 和 `example2` 函数中








