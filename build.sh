#!/bin/bash
# 意大利行程单 - 一键打包部署
# 用法: bash build.sh

cd "$(dirname "$0")"

NODE=/Users/huanghuacai/.workbuddy/binaries/node/versions/22.22.2/bin/node

echo "📦 1/3  嵌入图片到 HTML..."
$NODE -e "
const fs = require('fs');
let html = fs.readFileSync('意大利行程单.html', 'utf8');
const cities = ['sorrento', 'rome', 'florence', 'venice', 'milan'];
for (const c of cities) {
  const img = fs.readFileSync('images/' + c + '.png');
  html = html.replace(new RegExp(\"url\\\\('images/\" + c + \"\\\\.png'\\\\)\", 'g'), \"url('data:image/png;base64,\" + img.toString('base64') + \"')\");
}
fs.writeFileSync('deploy/index.html', html);
console.log('  → 图片已嵌入 (' + cities.length + ' 张)');
"

echo "📦 2/3  嵌入电子票 PDF..."
$NODE -e "
const fs = require('fs');
let html = fs.readFileSync('deploy/index.html', 'utf8');
const pdfs = [
  { path: 'tickets/uffizi-tickets.pdf', btnId: 'pdfBtn', relPath: 'tickets/uffizi-tickets.pdf' },
  { path: 'tickets/colosseo-tickets.pdf', btnId: 'colosseoBtn', relPath: 'tickets/colosseo-tickets.pdf' },
];
for (const pdf of pdfs) {
  if (fs.existsSync(pdf.path)) {
    const data = fs.readFileSync(pdf.path);
    const base64 = data.toString('base64');
    const dataURI = 'data:application/pdf;base64,' + base64;
    html = html.replace(
      pdf.btnId + \".setAttribute('href', '\" + pdf.relPath + \"');\",
      pdf.btnId + \".setAttribute('href', '\" + dataURI + \"');\"
    );
    console.log('  → ' + pdf.path + ' (' + (data.length / 1024).toFixed(0) + ' KB)');
  }
}
fs.writeFileSync('deploy/index.html', html);
"

echo "📦 3/3  统计文件大小..."
$NODE -e "
const fs = require('fs');
const size = fs.statSync('deploy/index.html').size;
console.log('  → deploy/index.html: ' + (size / 1024 / 1024).toFixed(1) + ' MB');
"

echo ""
echo "✅ 打包完成！告诉 WorkBuddy '部署到线上' 即可上线。"
