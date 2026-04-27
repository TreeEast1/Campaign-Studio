import { prisma } from "@/lib/prisma";
import type { ImageApiConfig, ImageProvider } from "@/services/image/types";

function asProvider(value?: string | null): ImageProvider {
  if (value === "replicate" || value === "custom") return value;
  return "openai";
}

export async function getImageApiConfig(): Promise<ImageApiConfig> {
  const dbConfig = await prisma.imageApiConfig.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });

  const provider = asProvider(process.env.IMAGE_API_PROVIDER || dbConfig?.provider);

  if (provider === "openai") {
    return {
      provider,
      apiKey: process.env.OPENAI_API_KEY || dbConfig?.apiKey || undefined,
      baseUrl: dbConfig?.baseUrl || undefined,
      model: process.env.OPENAI_IMAGE_MODEL || dbConfig?.model || "gpt-image-1",
      defaultSize: dbConfig?.defaultSize || "1024x1536",
    };
  }

  if (provider === "replicate") {
    return {
      provider,
      apiKey: process.env.REPLICATE_API_TOKEN || dbConfig?.apiKey || undefined,
      baseUrl: dbConfig?.baseUrl || undefined,
      model: process.env.REPLICATE_IMAGE_MODEL || dbConfig?.model || undefined,
      defaultSize: dbConfig?.defaultSize || "1024x1536",
    };
  }

  return {
    provider,
    apiKey: process.env.CUSTOM_IMAGE_API_KEY || dbConfig?.apiKey || undefined,
    baseUrl: process.env.CUSTOM_IMAGE_API_URL || dbConfig?.baseUrl || undefined,
    model: dbConfig?.model || undefined,
    defaultSize: dbConfig?.defaultSize || "1024x1536",
  };
}

export async function getImageApiStatus() {
  const config = await getImageApiConfig();
  return {
    provider: config.provider,
    model: config.model,
    defaultSize: config.defaultSize,
    hasApiKey: Boolean(config.apiKey),
    hasBaseUrl: Boolean(config.baseUrl),
  };
}
