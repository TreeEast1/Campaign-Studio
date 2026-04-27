import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getImageApiStatus } from "@/services/image/config";

export async function GET() {
  const status = await getImageApiStatus();
  return NextResponse.json(status);
}

export async function POST(request: Request) {
  const body = await request.json();
  await prisma.imageApiConfig.updateMany({ data: { isActive: false } });
  const config = await prisma.imageApiConfig.create({
    data: {
      provider: body.provider,
      apiKey: body.apiKey || null,
      baseUrl: body.baseUrl || null,
      model: body.model || null,
      defaultSize: body.defaultSize || null,
      isActive: true,
    },
  });

  return NextResponse.json({
    id: config.id,
    provider: config.provider,
    model: config.model,
    defaultSize: config.defaultSize,
    hasApiKey: Boolean(config.apiKey),
  });
}
