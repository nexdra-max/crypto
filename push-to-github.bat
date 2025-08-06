@echo off
echo 初始化Git仓库并推送代码到GitHub...

echo 初始化Git仓库...
git init

echo 添加所有文件...
git add .

echo 提交更改...
git commit -m "初始提交 - 加密货币资讯聚合平台"

echo 设置主分支名称...
git branch -M main

echo 添加远程仓库...
git remote add origin https://github.com/nexdra-max/crypto.git

echo 推送代码到GitHub...
git push -u origin main

echo 完成！
echo 请访问 https://github.com/nexdra-max/crypto 查看您的仓库
echo 然后在Settings > Pages 中启用GitHub Pages以部署网站

pause