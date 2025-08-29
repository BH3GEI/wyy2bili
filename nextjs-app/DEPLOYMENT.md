# 🚀 Vercel 部署指南

## 快速部署到 Vercel

### 方法一：一键部署 (推荐)

1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入此 GitHub 仓库
4. **重要**: 设置根目录为 `nextjs-app`
5. 点击 "Deploy"

### 方法二：Fork 后部署

1. Fork 此仓库到您的 GitHub 账号
2. 在 Vercel 中导入您的 Fork
3. 设置根目录为 `nextjs-app`
4. 部署完成

## 📝 部署配置

### Vercel 项目设置

```
Framework Preset: Next.js
Root Directory: nextjs-app
Node.js Version: 18.x (推荐)
```

### 环境变量

目前不需要设置任何环境变量，所有配置都在客户端完成。

## 🔧 本地开发

```bash
# 克隆仓库
git clone <your-repo-url>
cd wyy2bili/nextjs-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📱 使用方法

### 1. 准备歌单数据
由于 Vercel 不支持浏览器自动化，需要手动准备歌单：

- 访问您的网易云音乐歌单
- 复制歌曲信息，格式为 "歌名 - 歌手"
- 每行一首歌

### 2. 获取 Bilibili Cookie
- 登录 bilibili.com
- F12 → Application → Cookies → bilibili.com
- 复制 `SESSDATA` 和 `bili_jct` 的值

### 3. 开始同步
- 粘贴歌单到输入框
- 输入 Cookie 信息
- 等待自动同步完成

## 🆚 版本对比

| 特性 | Python 版本 | Next.js 版本 |
|------|-------------|--------------|
| **界面** | 命令行 | Web 界面 |
| **部署** | 本地运行 | Vercel 云端 |
| **歌单解析** | 自动 (Selenium) | 手动输入 |
| **跨平台** | 需要 Chrome | 任何浏览器 |
| **分享** | 不可分享 | 可分享链接 |
| **移动端** | 不支持 | 完全支持 |

## 🐛 故障排除

### 部署失败
- 确保根目录设置为 `nextjs-app`
- 检查 Node.js 版本 (推荐 18.x)

### Cookie 失效
- Bilibili Cookie 会定期过期，需要重新获取
- 确保 Cookie 值没有多余的空格

### 搜索无结果
- 检查歌曲名和歌手名的格式
- 某些歌曲可能在 Bilibili 上没有对应视频

## 📞 技术支持

如遇到问题，请：
1. 检查浏览器控制台错误
2. 确认 Cookie 有效性
3. 在 GitHub Issues 中报告问题

---

*享受云端同步的便利！*