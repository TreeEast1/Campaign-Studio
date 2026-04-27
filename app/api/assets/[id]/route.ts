import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const asset = await prisma.generatedAsset.update({
    where: { id: params.id },
    data: { isFinal: Boolean(body.isFinal) },
  });

  return NextResponse.json({ asset });
}
