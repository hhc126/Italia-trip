# 📦 版本管理规范

## 提交规范

每次修改后必须提交，提交消息格式：

- ✨ `✨ 新功能：描述`
- 🎨 `🎨 UI优化：描述`
- 🐛 `🐛 修复：描述`
- 🎫 `🎫 门票：描述`
- 📱 `📱 移动端：描述`
- 📝 `📝 文档：描述`

## 打标签规范

重要版本打标签：
- 稳定版：`v1.0-stable` / `v1.1-stable`
- 测试版：`v1.0-iphone-test`
- 功能版：`v1.1-drawer` (抽屉导航版)

```bash
# 打标签
git tag -a v1.1-stable -m "稳定版：抽屉导航 + 门票浮窗"

# 查看标签
git tag

# 切换到某个版本
git checkout v1.1-stable
```

## 回退操作

```bash
# 查看历史
git log --oneline

# 回退单个文件到某个版本
git checkout <commit-hash> -- 意大利行程单.html

# 回退整个项目到某个版本（谨慎！）
git reset --hard <commit-hash>
```

## 当前版本

- 最新提交：49e837c (v1.1)
- 未提交修改：抽屉导航 + 门票浮窗 + SVG地图
