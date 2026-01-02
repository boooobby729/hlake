# GitHub SSH 配置步骤指南

## 📋 前置检查

### 1. 检查现有 SSH 密钥
```bash
ls -la ~/.ssh/*.pub
```

### 2. 检查 SSH Agent 是否运行
```bash
eval "$(ssh-agent -s)"
```

---

## 🔑 步骤 1: 生成 GitHub 专用 SSH 密钥（推荐）

### 选项 A: 使用 Ed25519 算法（推荐，更安全）
```bash
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519_github
```

### 选项 B: 使用 RSA 算法（如果 Ed25519 不支持）
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/.ssh/id_rsa_github
```

**说明：**
- `-C` 后面是你的 GitHub 邮箱
- `-f` 指定密钥文件名（使用 `_github` 后缀区分）
- 按提示设置密码（可选，但推荐设置）

---

## ⚙️ 步骤 2: 配置 SSH Config

编辑 `~/.ssh/config` 文件，添加 GitHub 配置：

```bash
nano ~/.ssh/config
# 或
vim ~/.ssh/config
```

添加以下内容：

```
# GitHub 配置
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
  AddKeysToAgent yes
  UseKeychain yes
```

**说明：**
- `IdentityFile`: 指向你生成的 GitHub 专用密钥
- `IdentitiesOnly yes`: 只使用指定的密钥
- `AddKeysToAgent yes`: 自动添加到 SSH Agent
- `UseKeychain yes`: 在 macOS 上使用钥匙串存储密码

---

## 🔐 步骤 3: 添加密钥到 SSH Agent

### macOS (使用钥匙串)
```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_github
```

### Linux
```bash
ssh-add ~/.ssh/id_ed25519_github
```

---

## 📋 步骤 4: 复制公钥内容

```bash
# 显示公钥内容
cat ~/.ssh/id_ed25519_github.pub

# 或使用 pbcopy 直接复制到剪贴板（macOS）
pbcopy < ~/.ssh/id_ed25519_github.pub
```

**重要：** 复制完整的公钥内容（从 `ssh-ed25519` 或 `ssh-rsa` 开始到邮箱结束）

---

## 🌐 步骤 5: 添加公钥到 GitHub

1. 登录 GitHub
2. 点击右上角头像 → **Settings**
3. 左侧菜单选择 **SSH and GPG keys**
4. 点击 **New SSH key** 按钮
5. 填写信息：
   - **Title**: 给这个密钥起个名字（如：`MacBook Pro - 2024`）
   - **Key**: 粘贴刚才复制的公钥内容
6. 点击 **Add SSH key**

---

## ✅ 步骤 6: 测试连接

```bash
ssh -T git@github.com
```

**预期输出：**
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

如果看到这个提示，说明配置成功！

---

## 🔧 步骤 7: 配置 Git 使用 SSH（如果还没配置）

### 检查当前远程仓库 URL
```bash
git remote -v
```

### 如果使用 HTTPS，切换到 SSH
```bash
# 查看当前 URL
git remote get-url origin

# 切换到 SSH（替换为你的 GitHub 用户名和仓库名）
git remote set-url origin git@github.com:username/repository.git
```

---

## 📝 步骤 8: 验证 Git 配置

```bash
# 测试推送（如果有权限）
git push

# 或测试拉取
git pull
```

---

## 🛠️ 故障排除

### 问题 1: Permission denied (publickey)
**解决方案：**
```bash
# 检查密钥是否添加到 Agent
ssh-add -l

# 如果没有，手动添加
ssh-add ~/.ssh/id_ed25519_github

# 检查 SSH 配置
ssh -T -v git@github.com
```

### 问题 2: 连接超时
**解决方案：**
- 检查网络连接
- 检查防火墙设置
- 尝试使用 HTTPS 方式

### 问题 3: 密钥未找到
**解决方案：**
```bash
# 检查密钥文件是否存在
ls -la ~/.ssh/id_ed25519_github*

# 检查 SSH config 路径是否正确
cat ~/.ssh/config
```

---

## 🔒 安全建议

1. ✅ **使用专用密钥**：为 GitHub 单独生成密钥，不要复用其他服务的密钥
2. ✅ **设置密钥密码**：生成密钥时设置密码保护
3. ✅ **定期轮换密钥**：建议每年更换一次
4. ✅ **不要提交私钥**：确保 `.gitignore` 包含 SSH 相关文件
5. ✅ **使用 Ed25519**：比 RSA 更安全且更快

---

## 📚 相关命令速查

```bash
# 查看所有 SSH 密钥
ls -la ~/.ssh/

# 查看 SSH Agent 中的密钥
ssh-add -l

# 删除 SSH Agent 中的密钥
ssh-add -d ~/.ssh/id_ed25519_github

# 测试 GitHub 连接（详细模式）
ssh -T -v git@github.com

# 查看 SSH 配置
cat ~/.ssh/config
```

---

## ✅ 完成检查清单

- [ ] 生成 GitHub 专用 SSH 密钥
- [ ] 配置 `~/.ssh/config` 文件
- [ ] 添加密钥到 SSH Agent
- [ ] 复制公钥内容
- [ ] 在 GitHub 添加 SSH 公钥
- [ ] 测试 SSH 连接成功
- [ ] 配置 Git 使用 SSH URL
- [ ] 测试 Git 推送/拉取

---

**配置完成后，你就可以安全地使用 SSH 方式与 GitHub 交互了！** 🎉
