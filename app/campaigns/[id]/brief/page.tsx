import { notFound } from "next/navigation";
import { BriefEditor } from "@/components/BriefEditor";
import type { CampaignBrief } from "@/lib/brief";
import { generateBrief } from "@/lib/brief";
import { prisma } from "@/lib/prisma";

export default async function CampaignBriefPage({ params }: { params: { id: string } }) {
  const campaign = await prisma.campaign.findUnique({ where: { id: params.id } });
  if (!campaign) notFound();

  const brief = campaign.briefJson ? (JSON.parse(campaign.briefJson) as CampaignBrief) : generateBrief(campaign);

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">Brief 确认</h1>
          <p className="lead">{campaign.productName} 的结构化宣传 Brief，可编辑后进入 Prompt 生成。</p>
        </div>
      </div>
      <div className="panel">
        <BriefEditor campaignId={campaign.id} initialBrief={brief} />
      </div>
    </>
  );
}
