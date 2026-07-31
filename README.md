# RW Studio / 若雾工作室

这是 RW Studio 面向 GitHub 与 Vercel 的原生 Next.js 版本。页面视觉、动画、实验台和响应式体验与原项目保持一致，部署构建已从 Cloudflare Worker/Vinext 转换为 Vercel 可直接识别的 Next.js App Router。

## 技术栈

- Next.js 16 App Router
- React 19
- JavaScript / JSX
- Tailwind CSS 4 与现代 CSS
- Framer Motion
- 自定义 Canvas 山水与粒子系统
- 本地字体和响应式艺术背景资源

## 本地运行

需要 Node.js 20.9 或更高版本，推荐 Node.js 22。

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:3000`。

## 质量检查

```bash
npm run lint
npm test
```

## 部署到 Vercel

1. 将本目录全部文件推送到 GitHub 仓库根目录。
2. 在 Vercel 导入该 GitHub 仓库。
3. Framework Preset 选择 `Next.js`。
4. Root Directory 保持仓库根目录。
5. Build Command、Install Command 和 Output Directory 均保持默认，不要填写 `dist`。
6. 点击 Deploy。

Vercel 将自动运行本项目的 `npm run build` 并使用 `.next` 输出，不需要 `vercel.json` 或 SPA 重写规则。

## 页面

- `/`：沉浸式东方数字山水首页
- `/vision`：工作室理念
- `/experiments`：数字艺术实验
- `/experiments/first-mist-realm`：若雾初境实时实验
- `/future`：未来创作方向
