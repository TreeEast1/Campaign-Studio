export type ImageProvider = "openai" | "replicate" | "custom";

export type ImageApiConfig = {
  provider: ImageProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  defaultSize?: string;
};

export type GenerateImageInput = {
  prompt: string;
  size: string;
  materialType: string;
  campaignId: string;
};

export type GenerateImageResult = {
  imageUrl: string;
  provider: ImageProvider;
  model?: string;
  raw?: unknown;
};
