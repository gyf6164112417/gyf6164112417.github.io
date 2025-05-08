@echo off

:: 确保脚本抛出遇到的错误
set -e

:: 构建
call npm run build

:: 进入生成的构建文件夹
cd dist

:: 如果是发布到自定义域名
:: echo www.example.com > CNAME

:: 初始化 git 仓库
git init
git add -A
git commit -m "deploy"

:: 推送到 master 分支
git push -f https://github.com/gyf6164112417/gyf6164112417.github.io.git master:master

:: 返回上级目录
cd .. 