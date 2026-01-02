import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";

const queryClient = new QueryClient();

const App = () => {
  // 如果只有一个路由，可以考虑直接渲染（但为了保持路由系统，还是使用路由）
  const defaultPage = navItems.find(item => item.to === '/')?.page || navItems[0]?.page;
  
  // 调试信息
  useEffect(() => {
    console.log('✅ App 组件已加载');
    console.log('📋 路由配置:', navItems);
    console.log('📍 当前 hash:', window.location.hash);
  }, []);
  
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <HashRouter>
            <Routes>
              {navItems.map(({ to, page: Page }) => (
                <Route key={to} path={to} element={<Page />} />
              ))}
              {/* 捕获所有未匹配的路由，重定向到首页 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('❌ App 组件渲染出错:', error);
    return (
      <div style={{ padding: '20px', color: 'red', fontFamily: 'monospace' }}>
        <h1>App 组件错误</h1>
        <pre>{error.toString()}</pre>
        <pre>{error.stack || ''}</pre>
      </div>
    );
  }
};

export default App;
