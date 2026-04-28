# AI 智能拼豆像素化工具

将任意图片智能转换为拼豆图纸的 Web 应用。支持 MARD、Hama 等主流拼豆品牌色库，AI 辅助配色，一键导出 PNG 图纸和材料清单。

## 功能特性

- **图像导入** - 支持拖拽/点击上传 JPG、PNG、WebP 图片
- **像素化转换** - 5 种预设网格尺寸（16×16 ~ 64×64），标准豆/迷你豆规格
- **AI 配色匹配** - 内置 MARD 72 色 + Hama 24 色色库，加权欧氏距离最近邻匹配
- **颜色聚类** - 简化 K-Means 算法限制最大颜色数
- **图纸编辑** - 画笔、橡皮擦、取色器工具，实时修改
- **材料清单** - 自动统计各色拼豆用量，导出 TXT 文件
- **PNG 导出** - 带网格线和色板对照表的完整拼豆图纸
- **纯前端运行** - 所有计算在浏览器端完成，无需后端服务器

## 技术栈

| 技术 | 说明 |
|------|------|
| [Next.js 16](https://nextjs.org/) | React 框架 |
| [TypeScript 5](https://www.typescriptlang.org/) | 类型安全 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 样式框架 |
| [shadcn/ui](https://ui.shadcn.com/) | UI 组件库 |
| [Zustand](https://zustand.docs.pmnd.rs/) | 状态管理 |
| [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | 图像处理 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器访问
# http://localhost:3000
```

## 项目结构

```
src/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面
│   └── globals.css         # 全局样式
├── components/
│   ├── bead/
│   │   ├── ImageUploader.tsx        # 图片上传组件
│   │   ├── GridSettings.tsx         # 网格设置组件
│   │   ├── ColorLibrarySettings.tsx # 色库设置组件
│   │   ├── EditorToolbar.tsx        # 编辑工具栏组件
│   │   ├── PatternCanvas.tsx        # 像素画布组件
│   │   └── MaterialList.tsx         # 材料清单组件
│   └── ui/                  # shadcn/ui 组件
├── lib/
│   ├── bead-colors.ts      # 拼豆色库数据
│   ├── pixel-converter.ts  # 像素转换引擎
│   └── color-matcher.ts    # 颜色匹配引擎
└── store/
    └── bead-store.ts       # Zustand 状态管理
```

## 使用流程

1. 上传图片（JPG/PNG/WebP）
2. 设置网格尺寸和拼豆规格
3. 选择色库品牌和最大颜色数
4. 点击「生成像素预览」
5. 点击「AI 配色匹配」
6. 使用编辑工具微调（可选）
7. 导出 PNG 图纸和材料清单

## 色库

| 品牌 | 颜色数 | 说明 |
|------|--------|------|
| MARD | 72 色 | 标准拼豆色库，含荧光色 |
| Hama | 24 色 | 迷你豆常用色库 |

## 许可证

[MIT](LICENSE)


