import type { Campaign } from "@prisma/client";
import { MATERIALS } from "./materials";

export type CampaignBrief = {
  headline: string;
  subheadline: string;
  keyPoints: string[];
  priceBlock: string;
  scheduleBlock: string;
  processBlock: string;
  cta: string;
  riskNotes: string[];
  recommendedMaterials: string[];
};

function splitPoints(value?: string | null, max = 5) {
  return (value ?? "")
    .split(/[；;。\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function generateBrief(campaign: Campaign): CampaignBrief {
  const materials = JSON.parse(campaign.materials || "[]") as string[];
  const keyPoints = splitPoints(campaign.sellingPoints, 5);
  const riskNotes = [
    "避免使用保过、必上岸、100%录取等绝对化承诺。",
    "价格、日期、课时数需要在图片生成前人工复核。",
    campaign.notes || "",
  ].filter(Boolean);

  return {
    headline: `${campaign.productName}${campaign.scheduleInfo?.includes("2026") ? " · 2026暑期正式开课" : ""}`,
    subheadline:
      campaign.targetAudience && campaign.productType
        ? `面向${campaign.targetAudience}的${campaign.productType}规划方案`
        : campaign.targetAudience || campaign.productType || "产品宣传物料方案",
    keyPoints: keyPoints.length ? keyPoints : splitPoints(campaign.painPoints, 4),
    priceBlock: campaign.priceInfo || "价格信息待补充",
    scheduleBlock: campaign.scheduleInfo || "时间安排待补充",
    processBlock: campaign.processInfo || "流程信息待补充",
    cta: campaign.cta || "扫码咨询详情",
    riskNotes,
    recommendedMaterials: materials.length ? materials : MATERIALS.slice(0, 4).map((item) => item.type),
  };
}
