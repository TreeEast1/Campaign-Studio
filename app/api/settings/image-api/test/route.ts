import { NextResponse } from "next/server";
import { getImageApiConfig } from "@/services/image/config";

export async function POST() {
  const config = await getImageApiConfig();
  if (!config.apiKey) {
    return NextResponse.json(
      { ok: false, message: "生图 API 尚未配置，请先前往设置页面配置 API Key。" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `已检测到 ${config.provider} API Key。MVP 测试不会消耗生图额度，正式生成时会调用真实 API。`,
  });
}
