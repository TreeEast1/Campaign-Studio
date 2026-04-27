import { NextResponse } from "next/server";
import { getBrandProfile } from "@/lib/brand";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const profile = await getBrandProfile();
  return NextResponse.json(profile);
}

export async function POST(request: Request) {
  const body = await request.json();
  const current = await getBrandProfile();
  const updated = await prisma.brandProfile.update({
    where: { id: current.id },
    data: {
      brandName: body.brandName,
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      styleKeywords: JSON.stringify(body.styleKeywords || []),
      toneKeywords: JSON.stringify(body.toneKeywords || []),
      layoutHabits: JSON.stringify(body.layoutHabits || []),
      bannedClaims: JSON.stringify(body.bannedClaims || []),
    },
  });
  return NextResponse.json(updated);
}
