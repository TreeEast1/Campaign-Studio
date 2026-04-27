import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GenerateImageInput, GenerateImageResult, ImageApiConfig } from "@/services/image/types";

type OpenAIImageResponse = {
  data?: Array<{ url?: string; b64_json?: string }>;
};

export async function generateWithOpenAI(
  input: GenerateImageInput,
  config: ImageApiConfig,
): Promise<GenerateImageResult> {
  const response = await fetch(`${config.baseUrl || "https://api.openai.com/v1"}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model || "gpt-image-1",
      prompt: input.prompt,
      size: input.size || config.defaultSize || "1024x1536",
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI Images API 调用失败：${response.status} ${message}`);
  }

  const raw = (await response.json()) as OpenAIImageResponse;
  const first = raw.data?.[0];
  if (!first?.url && !first?.b64_json) {
    throw new Error("OpenAI Images API 未返回可用图片。");
  }

  if (first.url) {
    return { imageUrl: first.url, provider: "openai", model: config.model, raw };
  }

  const generatedDir = path.join(process.cwd(), "public", "generated");
  await mkdir(generatedDir, { recursive: true });
  const fileName = `${input.campaignId}-${input.materialType}-${Date.now()}.png`;
  await writeFile(path.join(generatedDir, fileName), Buffer.from(first.b64_json!, "base64"));

  return {
    imageUrl: `/generated/${fileName}`,
    provider: "openai",
    model: config.model,
    raw,
  };
}
