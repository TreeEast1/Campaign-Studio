import { notFound } from "next/navigation";
import { PromptWorkspace } from "@/components/PromptWorkspace";
import { prisma } from "@/lib/prisma";
import { getImageApiStatus } from "@/services/image/config";

export default async function CampaignPromptsPage({ params }: { params: { id: string } }) {
  const [campaign, apiStatus] = await Promise.all([
    prisma.campaign.findUnique({ where: { id: params.id }, include: { prompts: true } }),
    getImageApiStatus(),
  ]);
  if (!campaign) notFound();

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">Prompt 生成</h1>
          <p className="lead">每个物料都有独立 Prompt，包含品牌风格、版式、中文排版、合规和负面要求。</p>
        </div>
      </div>
      {!apiStatus.hasApiKey && <div className="warning">尚未配置生图 API。请前往 /settings/image-api 配置后再生成图片。</div>}
      <PromptWorkspace campaignId={campaign.id} prompts={campaign.prompts} apiConfigured={apiStatus.hasApiKey} />
    </>
  );
}
