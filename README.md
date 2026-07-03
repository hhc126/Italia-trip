# 🇮🇹 意大利之旅行程单

2026年7月11日-23日意大利之旅行程单，支持 iPhone 上作为 Web App 使用。

## 功能

- 🗓️ 完整行程（索伦托→罗马→佛罗伦萨→威尼斯→米兰）
- 📍 GPS 自动定位当前城市，高亮 + 自动滚动
- 🕐 实时当地时间 + 日出日落（NOAA 公式离线计算）
- 🌡️ 天气预报（Open-Meteo API）
- 🎫 4张电子门票内嵌（梵蒂冈/乌菲兹/斗兽场/博尔盖塞）
- 📱 支持 iPhone「添加到主屏幕」，全屏 App 体验
- 🔌 完全离线可用（天气需网络）
- 📝 批注模式（本地标记行程修改意见）

## 文件结构

```
意大利之旅/
├── 意大利行程单.html      ← 源文件（编辑这个）
├── build.sh              ← 打包部署脚本
├── images/               ← 城市背景图（5张）
├── tickets/              ← 电子门票 PDF（4张）
├── deploy/index.html     ← 部署版（自动生成，勿手动编辑）
├── archive/              ← 历史文件归档
└── .gitignore
```

## 使用方式

1. 编辑 `意大利行程单.html`
2. 运行 `bash build.sh` 生成 deploy/index.html
3. 部署到 CloudStudio 上线

## 在线访问

行程单已部署到 CloudStudio，iPhone Safari 直接打开链接即可使用。
