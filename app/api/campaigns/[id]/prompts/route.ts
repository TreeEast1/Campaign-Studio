import { NextResponse } from "next/server";
import { getBrandProfile } from "@/lib/brand";
import type { CampaignBrief } from "@/lib/brief";
import { generateBrief } from "@/lib/brief";
import { prisma } from "@/lib/prisma";
import { buildPromptPackage } from "@/lib/prompt";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const campaign = await prisma.campaign.findUnique({ where: { id: params.id } });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign 不存在" }, { status: 404 });
  }

  const brand = await getBrandProfile();
  const brief = campaign.briefJson ? (JSON.parse(campaign.briefJson) as CampaignBrief) : generateBrief(campaign);
  const materialTypes = (brief.recommendedMaterials?.length
    ? brief.recommendedMaterials
    : JSON.parse(campaign.materials || "[]")) as string[];

  await prisma.promptPackage.deleteMany({ where: { campaignId: campaign.id } });

  const created = await Promise.all(
    materialTypes.map((materialType) => {
      const prompt = buildPromptPackage(campaign, brief, brand, materialType);
      return prisma.promptPackage.create({
        data: {
          campaignId: campaign.id,
          ...prompt,
        },
      });
    }),
  );

  await Promise.all(
    created.map((prompt) =>
      prisma.generatedAsset.create({
        data: {
          campaignId: campaign.id,
          promptPackageId: prompt.id,
          materialType: prompt.materialType,
          materialName: prompt.materialName,
          size: prompt.size,
          status: "pending",
          qualityReport: "待调用真实生图 API。生成后请人工复核中文、价格、日期、二维码位置和合规表述。",
        },
      }),
    ),
  );

  return NextResponse.json({ prompts: created });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const existing = await prisma.promptPackage.findFirst({
    where: { id: body.id, campaignId: params.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Prompt Package 不存在" }, { status: 404 });
  }

  const prompt = await prisma.promptPackage.update({
    where: { id: body.id },
    data: {
      visualPrompt: body.visualPrompt,
      copyPrompt: body.copyPrompt,
      negativePrompt: body.negativePrompt,
    },
  });

  return NextResponse.json({ prompt });
}
