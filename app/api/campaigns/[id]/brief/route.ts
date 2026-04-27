import { NextResponse } from "next/server";
import { generateBrief } from "@/lib/brief";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => ({}));
  const campaign = await prisma.campaign.findUnique({ where: { id: params.id } });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign 不存在" }, { status: 404 });
  }

  const brief = body.brief || generateBrief(campaign);
  const updated = await prisma.campaign.update({
    where: { id: params.id },
    data: { briefJson: JSON.stringify(brief) },
  });

  return NextResponse.json({ campaign: updated, brief });
}
