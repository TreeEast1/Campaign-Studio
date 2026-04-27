import { getImageApiConfig } from "@/services/image/config";
import { generateWithCustomApi } from "@/services/image/custom";
import { generateWithOpenAI } from "@/services/image/openai";
import { generateWithReplicate } from "@/services/image/replicate";
import type { GenerateImageInput, GenerateImageResult } from "@/services/image/types";

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageResult> {
  const config = await getImageApiConfig();

  if (!config.apiKey) {
    throw new Error("生图 API 尚未配置，请先前往设置页面配置 API Key。");
  }

  if (config.provider === "openai") {
    return generateWithOpenAI(input, config);
  }

  if (config.provider === "replicate") {
    return generateWithReplicate(input, config);
  }

  if (config.provider === "custom") {
    return generateWithCustomApi(input, config);
  }

  throw new Error("未知的生图 API Provider。");
}
