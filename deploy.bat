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

:: 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:<USERNAME>/zhinenghuanzhuang.git master:gh-pages

:: 返回上级目录
cd .. 