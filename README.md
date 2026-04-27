# Campaign Studio

Campaign Studio 是一个 AI 产品宣传物料工作台，面向产品经理、运营人员和市场人员，用于把产品信息拆解成宣传 Brief、多物料 Prompt，并在配置真实生图 API 后生成正式宣传图片。

本项目不是 mock 生图工具。未配置 API Key 时，系统仍可完成 Campaign 创建、Brief 生成、Prompt 生成，但不会生成正式图片，也不会返回 mock success。

## 产品功能

- Campaign 创建：录入产品名称、用户痛点、卖点、价格、时间、流程、CTA、注意事项和物料类型。
- Brief 生成：自动提炼主标题、副标题、卖点、价格区、时间安排、流程、CTA 和风险提醒。
- 品牌注入：维护品牌色、风格关键词、语气、版式习惯和禁用宣称。
- 多物料 Prompt：为竖版海报、朋友圈图、小红书封面、公众号头图、易拉宝、传单、课程安排图、价格说明图、活动流程图生成不同 Prompt。
- 生图 API 配置：支持 OpenAI Images API、Replicate、自定义 HTTP API 的配置结构。
- 真实生图调用：OpenAI Provider 已实现基础调用结构，Replicate 和 Custom Provider 预留清晰接口。
- 结果管理：展示 pending、generating、success、failed、api_not_configured 状态，支持复制 Prompt、重新调用 API、下载和标记最终版。

## 技术栈

- Next.js App Router
- React / TypeScript
- Prisma
- SQLite
- OpenAI Images API Provider 结构

## 本地启动

```bash
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

打开 `http://localhost:3000`。

## 环境变量

复制 `.env.example` 为 `.env.local`，并按需填写：

```env
DATABASE_URL="file:./dev.db"

IMAGE_API_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
OPENAI_IMAGE_MODEL=gpt-image-1

REPLICATE_API_TOKEN=
REPLICATE_IMAGE_MODEL=

CUSTOM_IMAGE_API_URL=
CUSTOM_IMAGE_API_KEY=
```

请勿将 `.env.local`、数据库文件、API Key 或生成图片提交到 GitHub。`.gitignore` 已包含 `.env`、`.env.local`、`prisma/dev.db`、`public/generated`。

## 数据库初始化

```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

Seed 会创建默认品牌「逐梦清北」和 Demo Campaign「强基全年班」，并生成 Brief、Prompt Package 和 pending Asset。

如果本机 Prisma schema engine 在 SQLite `db push` 阶段异常，可使用项目内置兜底脚本初始化同等表结构：

```bash
npm run db:init
npm run prisma:seed
```

## 生图 API 配置

页面入口：`/settings/image-api`

可配置字段：

- `provider`: `openai`、`replicate`、`custom`
- `apiKey`: 页面中以密码输入，不会明文回显
- `baseUrl`: 自定义 API 或 OpenAI 兼容网关可用
- `model`: 默认 OpenAI 模型为 `gpt-image-1`
- `defaultSize`: 默认尺寸

生产环境应优先使用环境变量配置 API Key。页面保存 API Key 仅适合本地或内部 MVP 测试。

## OpenAI Images API

设置：

```env
IMAGE_API_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
OPENAI_IMAGE_MODEL=gpt-image-1
```

服务代码位于 `services/image/openai.ts`。OpenAI 返回 URL 时会记录远程 URL；返回 base64 时会保存到 `public/generated`。

## Replicate

设置：

```env
IMAGE_API_PROVIDER=replicate
REPLICATE_API_TOKEN=your_replicate_token
REPLICATE_IMAGE_MODEL=your_model_version
```

`services/image/replicate.ts` 已预留 Provider，MVP 暂未启用真实调用，需要接入具体模型版本和输出解析。

## 自定义生图 API

设置：

```env
IMAGE_API_PROVIDER=custom
CUSTOM_IMAGE_API_URL=https://your-api.example.com/generate
CUSTOM_IMAGE_API_KEY=your_custom_key
```

自定义接口需要接受 JSON：

```json
{
  "prompt": "full prompt",
  "size": "1080x1920",
  "materialType": "vertical_poster",
  "model": "optional"
}
```

并返回：

```json
{
  "imageUrl": "https://..."
}
```

## 未配置 API 时的系统行为

- 可以创建 Campaign。
- 可以生成和编辑 Brief。
- 可以生成、编辑、复制、保存 Prompt。
- 可以进入结果页。
- 点击生成图片会返回错误：`生图 API 尚未配置，请先前往设置页面配置 API Key。`
- 生成记录会保存为 `status = "api_not_configured"`。
- 页面只显示“待生成”占位，不会把占位图标记为正式生成结果。

## Prompt 生成流程

Prompt 模板包含：

- Role / Design Goal
- Brand Style
- Material Type
- Layout Requirements
- Text Content
- Visual Requirements
- Negative Requirements
- Chinese Typography Requirements
- Compliance and Risk Requirements

每种物料按场景单独生成 Prompt，不复用同一套文案。例如朋友圈图强调简洁传播，易拉宝强调完整信息，价格说明图突出价格和规则，课程安排图突出阶段时间轴。

## 目录结构

```text
app/
  api/
  brand/
  campaigns/
  settings/image-api/
components/
lib/
prisma/
services/image/
public/generated/
```

## Roadmap

- 完整接入 Replicate Provider。
- 增加素材上传、Logo/二维码管理和对象存储。
- 增加图片生成队列、批量重试和成本统计。
- 增加 Prompt 版本管理和团队协作审批。
- 增加真实图片质检：中文 OCR、价格日期校验、禁用宣称检测。
