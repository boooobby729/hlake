import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { tmpdir } from 'os';
import { devLogger } from '@meituan-nocode/vite-plugin-dev-logger';
import {
  devHtmlTransformer,
  prodHtmlTransformer,
} from '@meituan-nocode/vite-plugin-nocode-html-transformer';
import react from '@vitejs/plugin-react';

const CHAT_VARIABLE = process.env.CHAT_VARIABLE || '';
const PUBLIC_PATH = process.env.PUBLIC_PATH || '';

const isProdEnv = process.env.NODE_ENV === 'production';
const publicPath = (isProdEnv && CHAT_VARIABLE)
  ? PUBLIC_PATH + '/' + CHAT_VARIABLE
  : PUBLIC_PATH + '/';
const outDir = (isProdEnv && CHAT_VARIABLE) ? 'build/' + CHAT_VARIABLE : 'build';

async function loadPlugins() {
  const plugins = isProdEnv
  ? CHAT_VARIABLE
    ? [react(), prodHtmlTransformer(CHAT_VARIABLE)]
    : [react()]
  : [
      devLogger({
        dirname: resolve(tmpdir(), '.nocode-dev-logs'),
        maxFiles: '3d',
      }),
      react(),
      devHtmlTransformer(CHAT_VARIABLE, 'internal'),
    ];

  if (process.env.NOCODE_COMPILER_PATH) {
    const { componentCompiler } = await import(process.env.NOCODE_COMPILER_PATH);
    plugins.push(componentCompiler());
  }
  return plugins;
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const plugins = await loadPlugins();
  
  return {
    server: {
    proxy: {
      "/websso": {
        target: process.env.NODE_ENV === "prod"? "https://nocode.sankuai.com": "https://nocode.ee.test.sankuai.com",
        changeOrigin: true,
        xfwd: true,
      },
      "/api/coze": {
        target: "https://api.coze.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coze/, ""),
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // 确保 Authorization 头被正确转发
            if (req.headers.authorization) {
              proxyReq.setHeader('Authorization', req.headers.authorization);
              console.log('[代理] 转发 Authorization 头:', req.headers.authorization.substring(0, 20) + '...');
            } else {
              console.warn('[代理] 警告: 请求中没有 Authorization 头');
            }
            // 确保 Content-Type 也被转发
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('[代理] 响应状态:', proxyRes.statusCode);
            if (proxyRes.statusCode === 401) {
              console.error('[代理] 401 认证失败 - 请检查 API Token 是否有效');
            }
          });
        },
      },
    },
      host: '0.0.0.0', // 允许从局域网访问
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins,
    base: publicPath,
    build: {
      outDir,
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url)),
        },
        {
          find: 'lib',
          replacement: resolve(__dirname, 'lib'),
        },
      ],
    },
  };
});
