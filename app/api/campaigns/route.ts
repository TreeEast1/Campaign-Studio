import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { updatedAt: "desc" },
    include: { assets: true, prompts: true },
  });
  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  const body = await request.json();
  const campaign = await prisma.campaign.create({
    data: {
      productName: body.productName,
      productType: body.productType,
      targetAudience: body.targetAudience,
      painPoints: body.painPoints,
      sellingPoints: body.sellingPoints,
      priceInfo: body.priceInfo,
      scheduleInfo: body.scheduleInfo,
      processInfo: body.processInfo,
      cta: body.cta,
      notes: body.notes,
      stylePreference: body.stylePreference,
      materials: JSON.stringify(body.materials || []),
    },
  });
  return NextResponse.json(campaign, { status: 201 });
}
