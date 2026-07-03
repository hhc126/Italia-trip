#!/bin/bash
# 意大利行程单 - 一键打包部署
# 用法: bash build.sh

cd "$(dirname "$0")"

echo "📦 1/2  将图片嵌入 HTML..."
node -e "
const fs = require('fs');
let html = fs.readFileSync('意大利行程单.html', 'utf8');
const cities = ['sorrento', 'rome', 'florence', 'venice', 'milan'];
for (const c of cities) {
  const img = fs.readFileSync('images/' + c + '.png');
  html = html.replace(new RegExp(\"url\\\\('images/\" + c + \"\\\\.png'\\\\)\", 'g'), \"url('data:image/png;base64,\" + img.toString('base64') + \"')\");
}
fs.writeFileSync('deploy/index.html', html);
console.log('  → deploy/index.html 已更新 (' + (fs.statSync('deploy/index.html').size/1024/1024).toFixed(1) + ' MB)');
"

echo ""
echo "✅ 完成！接下来请告诉 WorkBuddy：'部署到线上'"
echo "   或者手动在对话中说：帮我部署"
