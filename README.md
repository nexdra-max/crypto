# 加密货币资讯聚合平台

这是一个低成本、低维护的加密货币资讯聚合平台，提供以下功能：

- 全球前30大交易所数据聚合与对比
- 加密货币最新资讯
- 出入金教程与技巧
- 活动公告
- 套利机会分析

## 特点

- 完全静态网站，使用GitHub Pages免费托管
- 自动数据更新，无需手动维护
- 响应式设计，适配各种设备
- 低代码，易于维护

## 技术栈

- HTML5 + CSS3 + JavaScript
- 使用CoinGecko API获取加密货币数据
- GitHub Actions自动更新数据

## 部署说明

### 将项目推送到GitHub

1. 确保已经创建了GitHub仓库：https://github.com/nexdra-max/crypto

2. 初始化Git仓库并推送代码：
   ```bash
   git init
   git add .
   git commit -m "初始提交"
   git branch -M main
   git remote add origin https://github.com/nexdra-max/crypto.git
   git push -u origin main
   ```

### 启用GitHub Pages

1. 在GitHub仓库页面，点击"Settings"
2. 在左侧菜单找到"Pages"
3. 在"Source"下选择"Deploy from a branch"
4. 在"Branch"下选择"main"，文件夹选择"/ (root)"
5. 点击"Save"

### 设置GitHub Actions

GitHub Actions工作流已经配置好，每小时自动更新一次加密货币数据。如果需要手动触发更新，可以在GitHub仓库的"Actions"页面手动运行工作流。

## 数据更新

网站数据通过GitHub Actions自动更新，更新频率为每小时一次。数据来源为CoinGecko API，包括：

- 加密货币市场数据
- 交易所数据
- 交易所交易对数据
- 套利机会分析

## 自定义

如果需要自定义网站，可以修改以下文件：

- `index.html`：首页
- `css/style.css`：样式
- `js/main.js`：主要JavaScript功能
- `js/market-data.js`：市场数据处理
- `js/news-feed.js`：新闻数据处理
- `pages/`：其他页面
