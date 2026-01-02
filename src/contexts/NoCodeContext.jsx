import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

const NoCodeSDKContext = createContext();

const useNoCodeSDKAvailability = () => {
  const [isAvailable, setIsAvailable] = useState(() => typeof window.NoCode !== 'undefined');

  useEffect(() => {
    if (isAvailable) return;

    const checkAvailability = () => {
      if (typeof window.NoCode !== 'undefined') {
        setIsAvailable(true);
        return true;
      }
      return false;
    };
    if (checkAvailability()) return;

    const interval = setInterval(() => {
      if (checkAvailability()) {
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAvailable]);

  return isAvailable;
};

export const useNoCodeSDK = () => {
  const context = useContext(NoCodeSDKContext);
  if (!context) {
    throw new Error('useNoCodeSDK must be used within a NoCodeProvider');
  }
  return context;
};

export const NoCodeProvider = ({ children }) => {
  const isAvailable = useNoCodeSDKAvailability();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState(null);
  
  // 在开发环境下，如果 SDK 不可用，直接跳过初始化
  // 使用 useMemo 稳定 isDevelopment 值，避免不必要的重新渲染
  const isDevelopment = useMemo(() => import.meta.env.MODE === 'development', []);

  useEffect(() => {
    // 在开发环境下且 SDK 不可用时，不尝试初始化
    if (isDevelopment && !isAvailable) return;
    if (!isAvailable || isReady || isLoading || initError) return;

    const initSDK = async () => {
      setIsLoading(true);
      setInitError(null);

      try {
        const modules = import.meta.glob('@/integrations/supabase/client.js');
        let supabaseConfig = Object.values(modules).length ? await Object.values(modules)[0]() : null;
        const result = await window.NoCode.init({
          env: import.meta.env.MODE,
          chatId: import.meta.env.VITE_CHAT_ID,
          chatEnv: import.meta.env.VITE_CHAT_ENV,
          disableSSO: import.meta.env.VITE_SSO_DISABLED === 'true',
          supabase: supabaseConfig?.supabase,
        });

        if (result.success) {
          setIsReady(true);
        } else {
          setInitError(new Error(result.error || 'NoCode SDK 初始化失败'));
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '未知错误';
        setInitError(new Error(errorMsg));
      } finally {
        setIsLoading(false);
      }
    };

    initSDK();
  }, [isAvailable, isReady, isLoading, initError, isDevelopment]);

  // 使用 useMemo 稳定 value 对象，避免不必要的重新渲染
  const value = useMemo(() => ({
    isReady,
  }), [isReady]);

  // 独立部署：如果 SDK 不可用，也显示内容（允许在无 SDK 环境下运行）
  // 开发环境：始终显示内容
  // 生产环境：SDK 可用时等待初始化完成，SDK 不可用时直接显示（独立部署模式）
  const shouldRenderChildren = useMemo(() => {
    if (isDevelopment) return true; // 开发环境始终显示
    if (!isAvailable) return true; // SDK 不可用，允许独立部署
    return isReady; // SDK 可用时，等待初始化完成
  }, [isReady, isDevelopment, isAvailable]);
  
  // 调试信息
  useEffect(() => {
    console.log('🔍 NoCodeProvider 状态:', {
      isAvailable,
      isReady,
      isLoading,
      isDevelopment,
      shouldRenderChildren,
      initError: initError?.message
    });
  }, [isAvailable, isReady, isLoading, isDevelopment, shouldRenderChildren, initError]);
  
  try {
    return (
      <NoCodeSDKContext.Provider value={value}>
        {shouldRenderChildren ? children : <div style={{padding: '20px', color: 'red'}}>等待 SDK 初始化...</div>}
      </NoCodeSDKContext.Provider>
    );
  } catch (error) {
    console.error('❌ NoCodeProvider 渲染出错:', error);
    return (
      <div style={{padding: '20px', color: 'red', fontFamily: 'monospace'}}>
        <h1>NoCodeProvider 错误</h1>
        <pre>{error.toString()}</pre>
        <pre>{error.stack || ''}</pre>
      </div>
    );
  }
};


