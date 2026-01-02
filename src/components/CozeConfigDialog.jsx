import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCozeConfig, saveCozeConfig } from '@/utils/cozeApi';

export const CozeConfigDialog = ({ open, onOpenChange }) => {
  const [apiToken, setApiToken] = useState('');
  const [workflowId, setWorkflowId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  // 当对话框打开时，加载当前配置
  useEffect(() => {
    if (open) {
      const config = getCozeConfig();
      setApiToken(config.token || '');
      setWorkflowId(config.workflowId || '');
      setSaveStatus(null);
    }
  }, [open]);

  const handleSave = async () => {
    if (!apiToken.trim() || !workflowId.trim()) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const success = saveCozeConfig(apiToken.trim(), workflowId.trim());
      if (success) {
        setSaveStatus('success');
        // 2秒后关闭对话框
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const config = getCozeConfig();
    setApiToken(config.token || '');
    setWorkflowId(config.workflowId || '');
    setSaveStatus(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>配置 Coze API</DialogTitle>
          <DialogDescription>
            请填写你的 Coze API Token 和 Workflow ID。配置将保存在本地浏览器中。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api-token">API Token</Label>
            <Input
              id="api-token"
              type="password"
              placeholder="pat_xxxxxxxxxxxxx"
              value={apiToken}
              onChange={(e) => {
                setApiToken(e.target.value);
                setSaveStatus(null);
              }}
            />
            <p className="text-xs text-muted-foreground">
              在 <a href="https://www.coze.cn/open" target="_blank" rel="noopener noreferrer" className="text-primary underline">Coze 开放平台</a> 获取 API Token
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workflow-id">Workflow ID</Label>
            <Input
              id="workflow-id"
              placeholder="7588851266873720832"
              value={workflowId}
              onChange={(e) => {
                setWorkflowId(e.target.value);
                setSaveStatus(null);
              }}
            />
            <p className="text-xs text-muted-foreground">
              在 Coze 平台的工作流设置中查看 Workflow ID
            </p>
          </div>
          {saveStatus === 'success' && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
              ✅ 配置已保存成功！
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              ❌ 保存失败，请检查输入是否正确
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            重置
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !apiToken.trim() || !workflowId.trim()}>
            {isSaving ? '保存中...' : '保存配置'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

