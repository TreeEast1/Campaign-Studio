import Link from "next/link";
import { ApiStatus } from "@/components/ApiStatus";
import { prisma } from "@/lib/prisma";
import { getImageApiStatus } from "@/services/image/config";

export default async function HomePage() {
  const [campaigns, apiStatus] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
    getImageApiStatus(),
  ]);

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">Campaign Studio</h1>
          <p className="lead">AI 产品宣传物料工作台</p>
        </div>
        <ApiStatus />
      </div>

      {!apiStatus.hasApiKey && (
        <div className="warning">
          当前尚未配置生图 API。你可以先创建宣传任务并生成 Prompt，配置 API 后再生成图片。
        </div>
      )}

      <div className="band">
        <div className="btn-row">
          <Link className="btn primary" href="/campaigns/new">
            新建宣传任务
          </Link>
          <Link className="btn" href="/settings/image-api">
            配置生图 API
          </Link>
          <Link className="btn mint" href="/brand">
            品牌配置
          </Link>
        </div>
      </div>

      <section>
        <h2>最近任务</h2>
        <div className="grid grid-3">
          {campaigns.map((campaign) => (
            <Link className="card" href={`/campaigns/${campaign.id}/brief`} key={campaign.id}>
              <h3>{campaign.productName}</h3>
              <p className="muted">{campaign.productType || "宣传任务"}</p>
              <p className="muted">{campaign.updatedAt.toLocaleString("zh-CN")}</p>
            </Link>
          ))}
          {campaigns.length === 0 && (
            <div className="card">
              <h3>强基全年班宣传物料包</h3>
              <p className="muted">运行 seed 后可直接体验完整 Demo。</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
