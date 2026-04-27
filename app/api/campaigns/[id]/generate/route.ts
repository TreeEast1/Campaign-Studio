import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateImage } from "@/services/image";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const promptPackage = await prisma.promptPackage.findFirst({
    where: {
      id: body.promptPackageId,
      campaignId: params.id,
    },
  });

  if (!promptPackage) {
    return NextResponse.json({ error: "Prompt Package 不存在" }, { status: 404 });
  }

  const asset =
    (await prisma.generatedAsset.findFirst({
      where: { promptPackageId: promptPackage.id },
    })) ||
    (await prisma.generatedAsset.create({
      data: {
        campaignId: params.id,
        promptPackageId: promptPackage.id,
        materialType: promptPackage.materialType,
        materialName: promptPackage.materialName,
        size: promptPackage.size,
        status: "pending",
      },
    }));

  await prisma.generatedAsset.update({
    where: { id: asset.id },
    data: { status: "generating", errorMessage: null },
  });

  const fullPrompt = [promptPackage.visualPrompt, promptPackage.copyPrompt, promptPackage.negativePrompt].join("\n\n");

  try {
    const result = await generateImage({
      prompt: fullPrompt,
      size: promptPackage.size,
      materialType: promptPackage.materialType,
      campaignId: params.id,
    });

    const updated = await prisma.generatedAsset.update({
      where: { id: asset.id },
      data: {
        imageUrl: result.imageUrl,
        status: "success",
        provider: result.provider,
        model: result.model,
        errorMessage: null,
        qualityReport: "已生成正式图片。请复核中文准确性、数字价格、日期课时、品牌规范和合规表述。",
      },
    });

    return NextResponse.json({ asset: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "生图失败";
    const status = message.includes("生图 API 尚未配置") ? "api_not_configured" : "failed";
    const updated = await prisma.generatedAsset.update({
      where: { id: asset.id },
      data: { status, errorMessage: message, imageUrl: null },
    });

    return NextResponse.json({ error: message, asset: updated }, { status: status === "api_not_configured" ? 400 : 502 });
  }
}
