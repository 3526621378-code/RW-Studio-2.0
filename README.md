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

## 部署到阿里云轻量应用服务器

生产服务器使用独立的 `rwstudio` 系统用户、systemd 服务与 Nginx 反向代理：

```bash
sudo bash deploy/scripts/bootstrap-server.sh
```

中国内地服务器默认从 RW Studio 的 Gitee 镜像拉取：

```bash
sudo bash deploy/scripts/bootstrap-server.sh
```

服务器安装依赖时默认使用阿里维护的 `registry.npmmirror.com` 国内镜像，
仓库地址和 npm 镜像仍可分别通过 `RW_STUDIO_REPOSITORY_URL` 和
`RW_STUDIO_NPM_REGISTRY` 环境变量覆盖。

以后从当前部署仓库拉取新版本并重新构建：

```bash
sudo bash /opt/rw-studio/deploy/scripts/update-server.sh
```

部署结构：

- Next.js 仅监听 `127.0.0.1:3000`
- Nginx 对外监听 `80`，并预留 `443`
- `/healthz` 用于服务器健康检查
- OpenClaw 和其他现有服务保持独立

域名解析生效后，使用以下脚本申请并启用 HTTPS：

```bash
sudo bash /opt/rw-studio/deploy/scripts/enable-https.sh "你的证书联系邮箱"
```

备案通过后的 DNS、HTTPS、ICP备案号和公安联网备案准备事项见
[`deploy/POST_FILING_CHECKLIST.md`](deploy/POST_FILING_CHECKLIST.md)。

## 页面

- `/`：沉浸式东方数字山水首页
- `/vision`：工作室理念
- `/experiments`：数字艺术实验
- `/experiments/first-mist-realm`：若雾初境实时实验
- `/future`：未来创作方向
