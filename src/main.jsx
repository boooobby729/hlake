import ReactDOM from "react-dom/client";
import React from 'react';
import App from "./App.jsx";
import { NoCodeProvider } from "./contexts/NoCodeContext.jsx";
import "./index.css";

// 确保 HashRouter 能正确初始化
// 如果当前 URL 没有 hash，自动添加 #/
if (!window.location.hash || window.location.hash === '#') {
  window.location.hash = '#/';
}

// 创建根节点并渲染应用
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ 找不到 root 元素！');
  // 如果找不到 root，创建一个
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  rootElement = newRoot;
}

console.log('✅ 找到 root 元素，开始渲染...');
console.log('📍 当前 URL:', window.location.href);
console.log('📍 当前 hash:', window.location.hash);

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <NoCodeProvider>
        <App />
      </NoCodeProvider>
    </React.StrictMode>
  );
  console.log('✅ React 应用已渲染');
} catch (error) {
  console.error('❌ React 渲染出错:', error);
  // 如果渲染失败，至少显示错误信息
  rootElement.innerHTML = `
    <div style="padding: 20px; color: red; font-family: monospace;">
      <h1>渲染错误</h1>
      <pre>${error.toString()}</pre>
      <pre>${error.stack || ''}</pre>
    </div>
  `;
}

