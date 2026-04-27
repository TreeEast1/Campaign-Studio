import type { GenerateImageInput, GenerateImageResult, ImageApiConfig } from "@/services/image/types";

export async function generateWithCustomApi(
  input: GenerateImageInput,
  config: ImageApiConfig,
): Promise<GenerateImageResult> {
  if (!config.baseUrl) {
    throw new Error("自定义生图 API 尚未配置 Base URL。");
  }

  const response = await fetch(config.baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: input.prompt,
      size: input.size,
      materialType: input.materialType,
      model: config.model,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`自定义生图 API 调用失败：${response.status} ${message}`);
  }

  const raw = (await response.json()) as { imageUrl?: string; url?: string };
  const imageUrl = raw.imageUrl || raw.url;
  if (!imageUrl) {
    throw new Error("自定义生图 API 未返回 imageUrl。");
  }

  return { imageUrl, provider: "custom", model: config.model, raw };
}
