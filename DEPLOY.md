# 部署指南

本指南将帮助你将项目部署到 GitHub 并让其他人可以访问。

## 方法一：使用 Vercel 部署（推荐，最简单）

### 步骤 1: 将代码推送到 GitHub

1. **初始化 Git 仓库（如果还没有）**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **在 GitHub 上创建新仓库**
   - 访问 https://github.com/new
   - 创建新仓库（例如：`heart-lake-app`）
   - **不要**初始化 README、.gitignore 或 license

3. **推送代码到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```

### 步骤 2: 在 Vercel 上部署

1. **访问 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你刚创建的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **环境变量（如果需要）**
   - 如果有 `.env` 文件，在 Vercel 的 Environment Variables 中添加
   - 注意：不要提交 `.env` 文件到 GitHub

5. **部署**
   - 点击 "Deploy"
   - 等待部署完成（通常 1-2 分钟）
   - 部署完成后会获得一个 URL，例如：`https://your-project.vercel.app`

### 步骤 3: 自定义域名（可选）

- 在 Vercel 项目设置中可以添加自定义域名

---

## 方法二：使用 Netlify 部署

### 步骤 1: 推送到 GitHub（同上）

### 步骤 2: 在 Netlify 上部署

1. **访问 Netlify**
   - 访问 https://www.netlify.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add new site" → "Import an existing project"
   - 选择 GitHub 仓库

3. **配置构建设置**
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Base directory**: (留空)

4. **环境变量**
   - 在 Site settings → Environment variables 中添加

5. **部署**
   - 点击 "Deploy site"
   - 等待部署完成

---

## 方法三：使用 GitHub Pages（需要更多配置）

### 步骤 1: 修改 vite.config.js

需要修改 `base` 配置为你的仓库名：

```javascript
base: '/你的仓库名/',
```

### 步骤 2: 安装 gh-pages

```bash
npm install --save-dev gh-pages
```

### 步骤 3: 添加部署脚本到 package.json

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d build"
  }
}
```

### 步骤 4: 部署

```bash
npm run deploy
```

访问地址：`https://你的用户名.github.io/仓库名/`

---

## 重要提示

### 1. 不要提交敏感文件

确保 `.gitignore` 包含：
```
node_modules
build
.env
.env.local
.env.*.local
.DS_Store
```

### 2. 环境变量

如果项目需要环境变量（如 API keys）：
- **不要**将 `.env` 文件提交到 GitHub
- 在部署平台（Vercel/Netlify）的设置中添加环境变量

### 3. 构建测试

在部署前，本地测试构建：
```bash
npm run build
npm run preview
```

### 4. 检查构建输出

确保 `build` 目录包含所有必要的文件。

---

## 推荐方案

**推荐使用 Vercel**，因为：
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 自动部署（每次 push 到 GitHub 自动重新部署）
- ✅ 全球 CDN
- ✅ 配置简单
- ✅ 支持自定义域名

---

## 常见问题

### Q: 部署后页面空白？
A: 检查 `vite.config.js` 中的 `base` 配置是否正确

### Q: 资源加载失败？
A: 确保所有资源路径使用相对路径，检查 `base` 配置

### Q: API 请求失败？
A: 检查环境变量是否正确配置，以及 API 是否允许跨域请求

