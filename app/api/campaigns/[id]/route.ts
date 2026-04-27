import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: { prompts: true, assets: true },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign 不存在" }, { status: 404 });
  }

  return NextResponse.json(campaign);
}
