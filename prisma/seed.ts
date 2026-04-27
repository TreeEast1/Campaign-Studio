import { PrismaClient } from "@prisma/client";
import { defaultBrandProfile, demoCampaign } from "../lib/defaults";
import { generateBrief } from "../lib/brief";
import { buildPromptPackage } from "../lib/prompt";

const prisma = new PrismaClient();

async function main() {
  const brand =
    (await prisma.brandProfile.findFirst()) ||
    (await prisma.brandProfile.create({
      data: {
        brandName: defaultBrandProfile.brandName,
        primaryColor: defaultBrandProfile.primaryColor,
        secondaryColor: defaultBrandProfile.secondaryColor,
        styleKeywords: JSON.stringify(defaultBrandProfile.styleKeywords),
        toneKeywords: JSON.stringify(defaultBrandProfile.toneKeywords),
        layoutHabits: JSON.stringify(defaultBrandProfile.layoutHabits),
        bannedClaims: JSON.stringify(defaultBrandProfile.bannedClaims),
      },
    }));

  let campaign = await prisma.campaign.findFirst({ where: { productName: demoCampaign.productName } });
  if (!campaign) {
    campaign = await prisma.campaign.create({
      data: {
        ...demoCampaign,
        materials: JSON.stringify(demoCampaign.materials),
      },
    });
  }

  const brief = generateBrief(campaign);
  campaign = await prisma.campaign.update({
    where: { id: campaign.id },
    data: { briefJson: JSON.stringify(brief) },
  });

  const existingPrompts = await prisma.promptPackage.count({ where: { campaignId: campaign.id } });
  if (existingPrompts === 0) {
    for (const materialType of demoCampaign.materials) {
      const prompt = buildPromptPackage(campaign, brief, brand, materialType);
      const promptPackage = await prisma.promptPackage.create({
        data: {
          campaignId: campaign.id,
          ...prompt,
        },
      });

      await prisma.generatedAsset.create({
        data: {
          campaignId: campaign.id,
          promptPackageId: promptPackage.id,
          materialType: promptPackage.materialType,
          materialName: promptPackage.materialName,
          size: promptPackage.size,
          status: "pending",
          qualityReport: "待调用真实生图 API。配置 API Key 后可生成正式图片。",
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
